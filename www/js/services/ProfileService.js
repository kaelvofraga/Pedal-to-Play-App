/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('ProfileService', ['$rootScope', '$http', 'localStorageService', 
				 	             function ($rootScope, $http, localStorageService) 
    {   
      
      var successCallback = function (response) {
        if (response.data) {
          var user = localStorageService.get('user');
          if (user !== null) {
            localStorageService.set('level' + user.id, response.data);
          }
          return response.data;  
        }
        return null;
      }
      
      var errorCallback = function (error) {        
        var user = localStorageService.get('user');
        if (user !== null) {
           var userLevel = localStorageService.get('level' + user.id);
           if (userLevel) {
             return userLevel;
           }
        }        
        return null;
      }
      
      return {
        getUserLevel: function () {
          return $http.get($rootScope.string.SERVER_BASE_URL + 'user/level')
                  .then(successCallback, errorCallback);
        }
		  };
    }]);
})();