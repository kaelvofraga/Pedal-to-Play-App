(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('ProfileService', ['$rootScope', '$http', '$q', 'localStorageService', 
				 	             function ($rootScope, $http, $q, localStorageService) {   
      
      var self = this;
       
      this.userLevel = null;
      
      var successCallback = function (response) {
        if (response.data) {
          var user = localStorageService.get('user');
          if (user !== null) {
            localStorageService.set('level' + user.id, response.data);
          }
          self.userLevel = response.data;
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
          
          var deferred = $q.defer();
          
          if (self.userLevel) {
            deferred.resolve(self.userLevel);
          } else {
            $http.get($rootScope.string.SERVER_BASE_URL + 'user/level')
              .then( 
                function (response) {
                  deferred.resolve(successCallback(response));
                },
                function (error) {
                  deferred.reject(errorCallback(error));
              });
          }         
                  
          return deferred.promise;                  
        }
		  };
      
    }]);
    
})();