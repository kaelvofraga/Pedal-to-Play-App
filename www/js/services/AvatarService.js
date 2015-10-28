/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('AvatarService', ['$rootScope', '$http', 'localStorageService', 'LoadingService',
                      function ($rootScope, $http, localStorageService, LoadingService) {
        
        var sucessCallback = function (scope, response, messageOut) {
          if (response.data && response.data.error) {
            scope.errorMessage = messageOut;
          }
          LoadingService.stopLoading();
        }

        var errorCallback = function (scope, error, messageOut) {
          scope.errorMessage = messageOut;
          LoadingService.stopLoading();
        }
        
        var saveLocally = function (avatar) {
          var user = localStorageService.get('user');
          localStorageService.set('avatar'+user.id, angular.copy(avatar));          
        };
            
        var searchLocally = function () {
          var user = localStorageService.get('user');
          return localStorageService.get('avatar'+user.id);
        };
  
        var saveRemotely = function (avatar, scope) {
          return true;
        };
  
        var searchRemotely = function (scope) {
          return null;
        };
        
        return {            
            recoverCustomization: function (scope) {
              var avatarCustomization = searchRemotely(scope);
              if (avatarCustomization === null) {
                return searchLocally();
              }
            },
            
            saveCustomization: function (avatar, scope) {
              saveLocally(avatar);
              return saveRemotely(avatar, scope);
            }
        };
      }]);
})();