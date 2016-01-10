//"use strict";

// Selectors
var $ = {}
$.one = function(s) { return document.querySelector(s) } // like jQuery(selector).get(0)
$.all = document.querySelectorAll // like jQuery(selector)
$.liveId = document.getElementById // like jQuery('#'+selector)[0]
$.liveTag = document.getElementsByTagName // like jQuery(tagName)
$.liveClass = document.getElementsByClassName // like jQuery(className)
Element.prototype.is = function(s) { // like jQuery(selector).is(selector)
  return (this.matches || this.matchesSelector || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector || this.oMatchesSelector).call(this, s);
}
Element.prototype.one = Element.prototype.querySelector // like jQuery(selector, this)[0]
Element.prototype.all = Element.prototype.querySelectorAll // like jQuery(selector, this)
Element.prototype.allIncludingSelf = function(s) {
  var r = []
  if (this.is(s)) {
    r.push(this)
  }
  return r.concat(Array.prototype.slice.call(this.querySelectorAll(s)))
}

// Events
Element.prototype.on = function(event, fn) {
  this.addEventListener(event, fn)
  return this
}

// Enumeration
var _ = {}
_.isObject = function(o) { return o !== null && typeof o === 'object' }
// array-like (e.g., NodeList does not extend Array but it iterates like one)
var isArrayLike = function(collection) {
  return collection.length != null && typeof collection.length == 'number' && collection.length > 0 
}
_.has = function(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key)
}
// cb type is function(value, key) return false to break
_.each = function(o, cb) {
  if (!o) return
  if (isArrayLike(o)) {
    for (var i=0; i<o.length; i++)
      if (false === cb(o[i], i))
        return
  } else
    for (var k in o)
      if (o.hasOwnProperty(k) && false === cb(o[k], k))
        return
}
_.keys = function(obj) {
  if (!_.isObject(obj)) return [];
  var keys = [];
  for (var key in obj) if (_.has(obj, key)) keys.push(key);
  return keys;
}
_.size = function(obj) {
  if (obj == null) return 0
  return isArrayLike(obj) ? obj.length : _.keys(obj).length;
}


// DOM Manipulation
$.createTag = function(tag, attrs, content, ns) {
  var e = document.createElementNS(ns, tag)
  if (_.isObject(attrs))
    for (var key in attrs)
      e.setAttribute(key, attrs[key])
  if (content)
    e.innerHTML = content
  return e
}
$.createSvgTag = function(tag, attrs, content) {
  return $.createTag(tag, attrs, content, 'http://www.w3.org/2000/svg')
}
$.createHtml = function(html) {
  return $.createTag("div", null, html).childNodes[0]
}
Element.prototype.append = document.appendChild
Element.prototype.appendTo = function(o) { $.one(o).append(this); return this }

