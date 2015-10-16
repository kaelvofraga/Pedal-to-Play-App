/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
	'use strict';

  angular.module('Pedal2Play')
  .factory('CordovaMainService', function() 
  {
    return {
      cordovaReady: function (fn) 
      {
        var queue = [];

        var impl = function () {
          queue.push(Array.prototype.slice.call(arguments));
        };

        document.addEventListener('deviceready', function () {
          queue.forEach(function (args) {
            fn.apply(this, args);
          });
          impl = fn;
        }, false);

        return function () {
          return impl.apply(this, arguments);
        };
      }
    };
  });
})();