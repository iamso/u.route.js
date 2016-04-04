;(function(u, window, history, undefined){
  'use strict';

  var support = history && history.pushState;
  var routes = [];
  var functions = [];
  var currentPath = '';
  var currentHash = '';
  var useHash = false;
  var hashPrefix = '#!';

  u.route = function(path, mw, fn) {
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

  u.route.use = function(fn) {
    (/^f/.test(typeof fn) && functions.indexOf(fn) < 0) && functions.push(fn);
  };

  u.route.redirect = function(path, replace) {
    useHash ?
      window.location.hash = hashPrefix + path :
      support ?
        (replace ? history.replaceState : history.pushState)({url: path, date: new Date()}, null, path) :
        window.location.href = path;
  };

  u.route.reload = function(state) {
    var pathname = useHash ? location.hash.replace(hashPrefix, '') : (state && state.url ? state.url : window.location.pathname).split('?')[0];
    var route;
    var matches;
    var pass = true;
    var params = {};
    var req = u.extend({}, location, {params: params, pathname: pathname, query: getQueryParams()});
    u.each(routes, function(i, r) {
      if (!route) {
        if (matches = pathname.match(r.regex)) {
          route = r;
        }
      }
    });
    if (route) {
      matches && (matches.shift(), matches = u.toArray(matches));
      u.each(matches, function(i, match) {
        params[route.keys[i].name] = match;
      });
      req = u.extend(req, {route: route.path, params: params});
      u.each(functions, function(i, fn) {
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
      u.each(functions, function(i, fn) {
        var tmp = fn.apply(window, [req]);
        pass = tmp === false ? tmp : pass;
      });
      if (pass) {
        req = u.extend(req, {route: null});
        u.route.default && u.route.default.apply(window, [req]);
      }
    }
    currentPath = pathname;
    currentHash = location.hash;
  };

  u.route.init = function(hash, prefix) {
    useHash = hash;
    hashPrefix = prefix || hashPrefix;
    (!useHash && support) && (history.onpushstate = u.route.reload);
    u(window).on('popstate', function(e){
      if (!useHash && currentPath === e.target.location.pathname && currentPath !== e.target.location.hash) {
        e.preventDefault();
        return false;
      }
      u.route.reload();
    });
    u.route.reload();
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

})(ujs, window, window.history);
