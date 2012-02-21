/*
  Copyright 2010 Nik Cubrilovic [http://nikcub.appspot.com]. All Rights Reserved.

  Use of this source code is governed by a 3-clause BSD license.
  See the LICENSE file for details.
*/

// Globals
var hostRegExp = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
var BP_DEBUG = true;
// brutal. bit of a double-tap, the last one finishes it off
var plusClasses_old = "a.gbzt, a.gbml1, a[href*='plus.google.com']";
var plusClasses = "#gbu";

(function (document) {

  var BlockPlus = {
    
    debugLevel: false,
    
    startTime: false,
    
    
    init: function (options) {
      BlockPlus.debug("Started BlockPlus");
      if(arguments.length > 0 && options instanceof Object) {
        BlockPlus.debugLevel = options.debug;
      }
      
      // document.addEventListener('beforeload', BlockPlus.checkSite, true);
      document.addEventListener('load', BlockPlus.hide_classes, true);
    },

    onEnable: function(ext) {
      console.log("BlockPlus Enabled");
    },
    
    debug: function(msg) {
      // if(BlockPlus.debugLevel && typeof console == 'object') {
        console.info(msg);
      // }
    },
    
    hide_classes: function(ev) {
      if(document.location.hostname == 'plus.google.com') {
        return ;
      }
      var ce = document.querySelectorAll(plusClasses);
      console.info("Checking:", plusClasses);
      console.info('got:', ce);
      if(ce.length > 0) {
        for(var c in ce) {
          console.info('blocking:', ce[c]);
          ce[c].style.display = 'none';
          // console.info(ce[c], ce[c].href);
          // if(BlockPlus.get_host(ce[c].href) == 'plus.google.com') {
          //   BlockPlus.debug("Blocking Class:", ce[c].href);
          //   ce[c].style.display = 'none';
          // }
        }
      }
    },
    
    hideClasses_old: function(ev) {
      if(document.location.hostname == 'plus.google.com') {
        return ;
      }
      for(var i = 0; i <= plusClasses_len; i++) {
        
      }
      for(cls in BlockPlus.plusClasses) {
        var ce = document.querySelectorAll(BlockPlus.plusClasses[cls]);
        BlockPlus.debug("Checking:", BlockPlus.plusClasses[cls], "found:", ce.length );
        if(ce.length > 0) {
          for(c in ce) {
            // console.info(ce[c], ce[c].href);
            if(BlockPlus.get_host(ce[c].href) == 'plus.google.com') {
              BlockPlus.debug("Blocking Class:", ce[c].href);
              ce[c].style.display = 'none';
            }
          }
        }
      }
    },
    
    checkSite: function(ev) {
      // console.info(ev);
      // console.info(ev.target.src);
      var full_url = ev.target.src || ev.url;
      console.info(full_url);
      
      if (!full_url || full_url.substr(0, 5) == 'data:') return 0;
      
      hs = BlockPlus.get_host(full_url);
      
      if(hs == 'plus.google.com' && document.location.host != hs) {
        ev.preventDefault();
        BlockPlus.debug('Blocked:', hs);
      }
    },
    
    chromeSender: function(rec, msg, cb) {
      msg = msg || "";
      cb = (typeof cb == 'undefined') ? function(x){return x;} : cb;
      chrome.extension.sendRequest({rec: rec, msg: msg}, cb);
    },
    
    siteMatch: function(hostname) {
      for(site in this.siteList) {
        if(!this.hostMatch(this.siteList[site], hostname))
          return true;
      }
      return false;
    },
    
    hostMatch: function(src1, src2) {
      var url1 = this.reverseString(src1);
      var url2 = this.reverseString(src2);
      var sub = (url1.length < url2.length) ? url1 : url2;
      
      return (url1.substr(0, sub.length) != url2.substr(0, sub.length));
    },
    
    reverseString: function (str) {
      return str.split('').reverse().join('');
    },
    
    // getHost will expand the scheme to set a full URL and then extract hostname
    get_host: function(url) {
      var re = hostRegExp;
      var match = url.match(re);
      if (match instanceof Array && match.length > 0) return match[1].toString().toLowerCase();
      return '';
    },
    
    getStorage: function (key) {
      var result = localStorage[key];
      if(typeof(result) == "undefined")
        return [];
      else
        return JSON.parse(result);
    },

    setStorage: function (key, value) {
      localStorage[key] = JSON.stringify(value);
    },
    
    cookieRead: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    },
      
    cookieWrite: function(name, val) {
      expires = "";
      document.cookie = name + "=" + val + expires + "; path=/";
    },
    
    logTime: function Timer() {
      this.start_ = new Date();

      this.elapsed = function() {
        return (new Date()) - this.start_;
      };

      this.reset = function() {
        this.start_ = new Date();
      };
    }
  };
  
  BlockPlus.init.prototype = BlockPlus;
  
  try {
    var options = { debug: false };
    if(document.location.hash == 'bp_debug' || BlockPlus.cookieRead('bp_debug')) {
      BlockPlus.cookieWrite('bp_debug', true);
      options.debug = true;
    }
    if(document.location.hash == 'bp_debug_stop') {
      BlockPlus.cookieWrite('bp_debug', '');
    }
    console.info("cookie", BlockPlus.cookieRead('bp_debug'));
    bp = window.BlockPlus = new BlockPlus.init(options);
  } catch(Error) {
    console.error('Error: ' + arguments[0] + ' ' + Error.message);
    console.error(Error.stack);
  }
    
})(document);
