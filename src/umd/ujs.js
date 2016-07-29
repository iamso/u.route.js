
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
