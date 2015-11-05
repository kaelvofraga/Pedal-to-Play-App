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
    
    return {
      getCurrentPosition: CordovaMainService.cordovaReady(cordovaGetCurrentPosition)    
    };
  }]);    
})();