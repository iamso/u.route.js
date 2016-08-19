/*!
 * u.route.js - Version 0.6.0
 * simple routing for the browser
 * Author: Steve Ottoz <so@dev.so>
 * Build date: 2016-08-19
 * Copyright (c) 2016 Steve Ottoz
 * Released under the MIT license
 */
;(function (factory) {
  'use strict';

  if (/^f/.test(typeof define) && define.amd) {
    define(['ujs'], factory);
  }
  else if (/^o/.test(typeof exports)) {
    factory(require('ujs'));
  }
  else {
    factory(ujs);
  }
})(function ($) {



  ;(function(history){
    'use strict';
    if (!history && !history.pushState) {
      return false;
    }
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function(state, title) {
      var returnValue = pushState.apply(history, arguments);
      title && (document.title = title);
      triggerEvent('push', state);
      return returnValue;
    };
    history.replaceState = function(state, title) {
      var returnValue = replaceState.apply(history, arguments);
      title && (document.title = title);
      triggerEvent('replace', state);
      return returnValue;
    };

    function triggerEvent(type, state) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(type + 'state', true, true, state);
      window.dispatchEvent(event);
    }
  })(window.history);


  'use strict';

  var support = history && history.pushState;
  var routes = [];
  var functions = [];
  var currentPath = '';
  var currentHash = '';
  var useHash = false;
  var hashPrefix = '#!';

  $.route = function(path, mw, fn) {
    var data = {};
    data.path = path;
    data.mw = fn ? mw : null;
    data.fn = fn || mw;
    data.keys = [];
    data.params = {};
    data.regex = pathToRegexp(data.path, data.keys, false, false);
    // data.regex = new RegExp(data.path.replace(/:[^\s/]+/g, '([\\w-]+)'));
    routes.push(data);
  };

  $.route.use = function(fn) {
    (/^f/.test(typeof fn) && functions.indexOf(fn) < 0) && functions.push(fn);
  };

  $.route.redirect = function(path, replace) {
    useHash ?
      window.location.hash = hashPrefix + path :
      support ?
        (replace ? history.replaceState : history.pushState)({url: path, date: new Date()}, null, path) :
        window.location.href = path;
  };

  $.route.reload = function(state) {
    var pathname = useHash ? location.hash.replace(hashPrefix, '') : (state && state.url ? state.url : window.location.pathname).split('?')[0];
    var route;
    var matches;
    var pass = true;
    var params = {};
    var req = $.extend({}, location, {params: params, pathname: pathname, query: getQueryParams()});
    $.each(routes, function(i, r) {
      if (!route) {
        if (matches = pathname.match(r.regex)) {
          route = r;
        }
      }
    });
    if (route) {
      matches && (matches.shift(), matches = $.makeArray(matches));
      $.each(matches, function(i, match) {
        params[route.keys[i].name] = match;
      });
      req = $.extend(req, {route: route.path, params: params});
      $.each(functions, function(i, fn) {
        var tmp = fn.apply(window, [req]);
        pass = tmp === false ? tmp : pass;
      });
      if (pass) {
        if (route.mw) {
          if (route.mw.apply(window, [req]) !== false) {
            route.fn.apply(window, [req]);
          }
        }
        else {
          route.fn.apply(window, [req]);
        }
      }
    }
    else {
      $.each(functions, function(i, fn) {
        var tmp = fn.apply(window, [req]);
        pass = tmp === false ? tmp : pass;
      });
      if (pass) {
        req = $.extend(req, {route: null});
        $.route.default && $.route.default.apply(window, [req]);
      }
    }
    currentPath = pathname;
    currentHash = location.hash;
  };

  $.route.init = function(hash, prefix) {
    useHash = hash;
    hashPrefix = prefix || hashPrefix;
    $(window).on('popstate pushstate replacestate', function(e){
      if (!useHash && currentPath === e.target.location.pathname && currentPath !== e.target.location.hash) {
        e.preventDefault();
        return false;
      }
      $.route.reload();
    });
    $.route.reload();
  };

  function pathToRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) {
      return path;
    }
    if (path instanceof Array) {
      path = '(' + path.join('|') + ')';
    }

    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        // keys.push(key);
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');

    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

  function getQueryParams() {
    var params = {};
    var tokens;
    var regex = /[?&]?([^=]+)=([^&]*)/g;
    var queryString = window.location.search;

    queryString = queryString.split('+').join(' ');

    while (tokens = regex.exec(queryString)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }


});
