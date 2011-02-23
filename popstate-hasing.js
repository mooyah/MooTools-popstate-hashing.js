(function($,$$) {

var Address = {

  init:function() {
    if(this.supportsPopState()) {
      window.onpopstate = this.onAddressChange.bind(this);
    }
    else {
      window.addEvent('hashchange',this.onHashChange.bind(this));
    }
    this.setCurrentAsPrevious();
  },

  includeGoogleHashURLs:function() {
    return true;
  },

  supportsPopState : function() {
    var history = window.history || {};
    return 'pushState' in history;
  },

  isHashchangeSupportIncluded : function() {
    return !! window.sethash;
  },

  get : function() {
    var url = this.getURL();
    var path = (url.match(/^.+?\/\/[^\/]+(\/.*)$/) || [null,''])[1];
    if(!this.supportsPopState()) {
      var u = this.getHash();
      path = u ? u : path;
    }
    return path;
  },

  set : function(url,title) {
    if(this.supportsPopState()) {
      window.history.pushState(null,title,url);
      this.onAddressChange();
    }
    else {
      if(this.includeGoogleHashURLs()) {
        if(url.substr(0,2)!='#!') {
          if(url.charAt(0)=='#') {
            url = url.substr(1);
          }
          url = '#!'+url;
        }
      }
      this.setHash(url);
    }
  },

  getURL : function() {
    return new String(window.location);
  },

  getHash : function() {
    var url = this.getURL();
    var index = url.indexOf('#');
    if(index>0) {
      var hash = url.substr(index);
      if(hash.length>1) {
        return hash;
      }
    }
  },

  setHash : function(hash) {
    window.sethash(hash);
  },

  onAddressChange : function() {
    var url = this.getURL();
    var path = (url.match(/^.+?\/\/[^\/]+(\/.*)$/) || [null,''])[1];
    window.fireEvent('address:popstate',[path]);
    this.onChange(path,'pushState');
  },

  onHashChange : function(hash) {
    hash = hash || '';
    if(hash.charAt(0)=='#') {
      hash = hash.substr(1);
    }
    if(this.includeGoogleHashURLs() && hash.charAt(0)=='!') {
      hash = hash.substr(1);
    }
    window.fireEvent('address:hashchange',[hash]);
    this.onChange(hash,'hash');
  },

  setCurrentAsPrevious : function() {
    this.previous = this.get();
  },

  getPrevious : function() {
    return this.previous;
  },

  onChange : function(path,source) {
    var previous = this.getPrevious();
    this.setCurrentAsPrevious();
    window.fireEvent('addressChange',[path,source,previous]);
  }

};

Address.init();

this.setAddress = function(adr) {
  Address.set(adr);
};

this.getAddress = function() {
  return Address.get();
};

})(document.id,$$);
