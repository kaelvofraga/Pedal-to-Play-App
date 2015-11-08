(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('ProfileService', ['$rootScope', '$http', 'localStorageService', 
				 	             function ($rootScope, $http, localStorageService) {   
      
      var DEFAULT_LEVEL = 1;
      
      var successCallback = function (response) {
        if (response.data) {
          var user = localStorageService.get('user');
          if (user !== null) {
            localStorageService.set('level' + user.id, response.data);
          }
          return response.data;  
        }
        return DEFAULT_LEVEL;
      }
      
      var errorCallback = function (error) {        
        var user = localStorageService.get('user');
        if (user !== null) {
           var userLevel = localStorageService.get('level' + user.id);
           if (userLevel) {
             return userLevel;
           }
        }        
        return DEFAULT_LEVEL;
      }
      
      return {
        getUserLevel: function () {
          return $http.get($rootScope.string.SERVER_BASE_URL + 'user/level')
                  .then(successCallback, errorCallback);
        }
		  };
    }]);
})();