(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('NetworkService', ['CordovaMainService', function (CordovaMainService) 
    {                        
        return {
           isConnected: CordovaMainService.cordovaReady(function () {
               return navigator.connection.type !== Connection.NONE;
           })
        };
    }]);
})();