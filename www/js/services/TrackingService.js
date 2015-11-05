(function () { 
	'use strict';

  angular.module('Pedal2Play')
  .factory('TrackService', ['$rootScope', 'CordovaMainService', 
                function ($rootScope, CordovaMainService) {
    
    var cordovaGetCurrentPosition = function (onSuccess, onError, options) 
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
    }    
    
    var cordovaIsLocationEnabled = function (onSuccess, onError) 
    {      
      cordova.plugins.diagnostic.isLocationEnabled(
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
        }
      );
    }    
    
    return {
      getCurrentPosition: CordovaMainService.cordovaReady(cordovaGetCurrentPosition),
      isLocationEnabled: CordovaMainService.cordovaReady(cordovaIsLocationEnabled)     
    };
  }]);    
})();