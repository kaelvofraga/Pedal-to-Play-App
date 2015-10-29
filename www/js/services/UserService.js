/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('UserService', ['$rootScope', '$http', 'localStorageService', 
				 	function ($rootScope, $http, localStorageService) 
    {   
      
      var successCallback = function (response) {
        var user = localStorageService.get('user');
        if (user !== null) {
          localStorageService.set('level' + user.id, response.data);
        }
        return response.data;
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