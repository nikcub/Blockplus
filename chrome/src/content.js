/*
  Copyright 2010 Nik Cubrilovic [http://nikcub.appspot.com]. All Rights Reserved.

  Use of this source code is governed by a 3-clause BSD license.
  See the LICENSE file for details.
*/

// Globals
var hostRegExp = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
var BP_DEBUG = true;
var plusClasses_old = "a.gbzt, a.gbml1, a[href*='plus.google.com']";
// @since v4
var plusClasses = "#gbu";

document.addEventListener('beforeload', check_site, true);
document.addEventListener('load', hide_classes, true);

function hide_classes(ev) {
  if(document.location.hostname == 'plus.google.com') return 0;
  
  var ce = document.querySelectorAll(plusClasses);
  
  if(ce.length > 0) {
    for(var c in ce) {
      // console.info('block_class:', ce[c]);
      try {
        ce[c].style.display = 'none';
      } catch(e) { }
    }
  }
  
  return 1;
};


function check_site(ev) {
  var full_url = ev.target.src || ev.url;
  // console.info(full_url);
  
  if (!full_url || full_url.substr(0, 5) == 'data:') return 0;
  
  hs = get_host(full_url);
  
  if(hs == 'plus.google.com' && document.location.host != hs) {
    ev.preventDefault();
    // console.info('block_site:', hs);
  }
  
  return 0;
};

// Utility functions
function $(selector, rootNode) {
    var root = rootNode || document;
    var nodeList = root.querySelectorAll(selector);
    if (nodeList.length) {
      return Array.prototype.slice.call(nodeList);
    }
    return [];
};

function reverse_string(str) {
    return str.split('').reverse().join('');
};

function get_host(url) {
    var re = hostRegExp;
    var match = url.match(re);
    if (match instanceof Array && match.length > 0) return match[1].toString().toLowerCase();
    return false;
};

function chrome_sender(rec, msg, cb) {
  msg = msg || "";
  cb = (typeof cb == 'undefined') ? function(x){return x;} : cb;
  chrome.extension.sendRequest({rec: rec, msg: msg}, cb);
};

function site_match(hostname) {
  for(site in this.siteList) {
    if(!this.hostMatch(this.siteList[site], hostname))
      return true;
  }
  return false;
};

function host_match(src1, src2) {
  var url1 = this.reverseString(src1);
  var url2 = this.reverseString(src2);
  var sub = (url1.length < url2.length) ? url1 : url2;
  
  return (url1.substr(0, sub.length) != url2.substr(0, sub.length));
};

function reverseString(str) {
  return str.split('').reverse().join('');
};

function getStorage(key) {
  var result = localStorage[key];
  if(typeof(result) == "undefined")
    return [];
  else
    return JSON.parse(result);
};

function setStorage(key, value) {
  localStorage[key] = JSON.stringify(value);
};

function cookieRead(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};
  
function cookieWrite(name, val) {
  expires = "";
  document.cookie = name + "=" + val + expires + "; path=/";
};