
  ;(function(history){
    'use strict';
    if (!history && !history.pushState) {
      return false;
    }
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function(state) {
      var returnValue = pushState.apply(history, arguments);
      triggerEvent('push', state);
      return returnValue;
    };
    history.replaceState = function(state) {
      var returnValue = replaceState.apply(history, arguments);
      triggerEvent('replace', state);
      return returnValue;
    };

    function triggerEvent(type, state) {
      var event = new CustomEvent(type + 'state', {
        detail: state,
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
    }
  })(window.history);
