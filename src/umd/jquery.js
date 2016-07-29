
;(function (factory) {
  'use strict';

  if (/^f/.test(typeof define) && define.amd) {
    define(['jquery'], factory);
  }
  else if (/^o/.test(typeof exports)) {
    factory(require('jquery'));
  }
  else {
    factory(jQuery);
  }
})(function ($) {
