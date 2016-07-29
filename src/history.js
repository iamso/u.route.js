
  ;(function(history){
    'use strict';
    if (!history && !history.pushState) {
      return false;
    }
    var pushState = history.pushState;
    var replaceState = history.replaceState;
    history.pushState = function(state) {
      var returnValue = pushState.apply(history, arguments);
      if (/^f/.test(typeof history.onpushstate)) {
          history.onpushstate(state);
      }
      return returnValue;
    };
    history.replaceState = function(state) {
      var returnValue = replaceState.apply(history, arguments);
      if (/^f/.test(typeof history.onpushstate)) {
          history.onpushstate(state);
      }
      return returnValue;
    };
  })(window.history);
