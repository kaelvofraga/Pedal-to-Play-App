/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
	'use strict';

  angular.module('Pedal2Play')
  .factory('TrackService', ['$rootScope', 'CordovaMainService', 
                function ($rootScope, CordovaMainService) {
    return {
      getCurrentPosition: CordovaMainService.cordovaReady( function (onSuccess, onError, options) 
      {
        navigator.geolocation.getCurrentPosition(
          function () {
            var that = this, args = arguments;

            if (onSuccess) {
              $rootScope.$apply(function () {
                onSuccess.apply(that, args);
              });
            }
          },
          function () {
            var that = this, args = arguments;

            if (onError) {
              $rootScope.$apply(function () {
                onError.apply(that, args);
              });
            }
          },
          options);
      })
     };
  }]);    
})();