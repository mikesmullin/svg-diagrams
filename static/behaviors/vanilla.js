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
// cb type is function(value, key) return false to break
_.each = function(o, cb) {
  if (!o) return
  if (typeof o.length == 'number' && o.length > 0) { // array-like (e.g., NodeList does not extend Array but it iterates like one)
    for (var i=0; i<o.length; i++)
      if (false === cb(o[i], i))
        return
  } else
    for (var k in o)
      if (o.hasOwnProperty(k) && false === cb(o[k], k))
        return
}

// DOM Manipulation
$.createTag = function(tag, attrs, content) {
  var e = document.createElement(tag)
  if (_.isObject(attrs))
    for (var key in attrs)
      e.setAttribute(key, attrs[key])
  if (content)
    e.innerHTML = content
  return e
}
$.createHtml = function(html) {
  return $.createTag("div", null, html).childNodes[0]
}
Element.prototype.append = document.appendChild
Element.prototype.appendTo = function(o) { $.one(o).append(this); return this }

// Asynchronous Requests
//   cb type is function(err, data, status, xhr)
$.xhr = function(method, url, data, cb) {
  var r
  try {
    r = new XMLHttpRequest()
    r.open(method, url, true)
    r.onreadystatechange = function() {
      if (r.readyState !== 4)
        return
      if (r.status !== 200)
        return cb(r.statusText, null, r.status, r)
      return cb(null, r.responseText, r.status, r)
    }
    r.send(data || undefined)
  } catch (err) {
    return cb(err, null, r.status, r)
  }
}

// Dependency Injection; ES6-compatible shim
//   Modules can be cross-compatible with CommonJS by beginning like:
//     module = {}
//     module.exports = app.exports['path/to/file'] = function() { ... }
window.app = { exports: {} }
window.System = {}
System.import = function(filename) {
  var _cb
  switch(filename.substr(filename.lastIndexOf('.')+1)) {
  case "js":
    $.createTag("script", { "src": filename }).on('load', function() {
      _cb(window.app.exports[filename]) }).appendTo("body") // passes module.exports equivalent
    break;
  case "css":
    $.createTag("link", { "rel": "stylesheet", "href": filename, "onload": function() { 
      _cb() }}).appendTo("body") // only invokes callback
    break;
  default:
    $.xhr("get", filename, null, function(err, data, status, xhr) {
      if (status === 200)
        _cb(data) }) // passes content as string
  }
  return { then: function(cb) { _cb = cb } }
}

// Template Expressions
//   basic js eval inside double curly braces; 
//   use to print and format variables.
//   MAY NOT use for flow control.
$.expr = function(template, context) {
  return template.replace(/{{(.+?)}}/g, function(nil, match) {
    try { with(context||window) return eval(match) }
    catch(e) { console.trace(e); return undefined }
  })
}

// Examples
//$.one("body").append($.createTag("strong", null, $.expr("the time is {{new Date()}}")))

// HTML Directives; flow control markup
//   data-repeat="var in collection": for...each loop duplicates its children once-per-item
//   data-hide="condition": css display:none if eval true
$.directives = function(markup, scope) {
  var node = $.createHtml(markup)
  var lvl1 = function() {
    _.each(node.allIncludingSelf("[data-repeat]"), function(e) {
      var m
      if (null !== (m = /(\w+)(\s*,\s*(\w+))?\s+in\s+(\w+)/g.exec(e.getAttribute("data-repeat")))) { // parse expression: <value>[, <key>] in <collection>
        e.removeAttribute("data-repeat")
        var template = e.innerHTML
        e.innerHTML = ""
        _.each(eval(m[4]), function(val, key) {
          var context = {}
          context[m[1]] = val
          context[m[3]] = key
          e.innerHTML += $.expr(template, context)
          lvl2(e, context)
        })
      }    
    })
  }
  var lvl2 = function(node, context) {    
    _.each(node.allIncludingSelf("[data-hide]"), function(e) {
        if (eval("with(context||window)"+ e.getAttribute("data-hide")))
          e.style.display = 'none'
          //e.parentNode.removeChild(e)
        e.removeAttribute("data-hide")
    })
  }
  lvl1(node)
  lvl2(node)
  node.innerHTML = $.expr(node.innerHTML)
  return node
}

// Routing: TBD
