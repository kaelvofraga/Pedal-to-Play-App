/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('AvatarService', ['$rootScope', '$http', 'localStorageService', 'LoadingService',
                      function ($rootScope, $http, localStorageService, LoadingService) {
        
        var onConnectToSaveSuccess = function (scope, response) {
          if (response.data && response.data.error) {
             scope.errorMessage = $rootScope.string.avatar.SERVER_SAVE_FAIL;
             return false;
          }
          return true;
        }

        var onConnectToSaveError = function (scope, error) {
            //TODO pull request in the queue
            return true;
        }
        
        var saveLocally = function (avatar) {
          var user = localStorageService.get('user');
          localStorageService.set('avatar' + user.id, angular.copy(avatar));          
        };
            
        var searchLocally = function () {
          var user = localStorageService.get('user');
          return localStorageService.get('avatar' + user.id);
        };
  
        var saveRemotely = function (avatar, scope) {
          LoadingService.startLoading();
          return $http.put($rootScope.string.SERVER_BASE_URL + 'avatar', avatar)
                  .then(
                    function (response) {
                      LoadingService.stopLoading();
                      return onConnectToSaveSuccess(scope, response);
                    },
                    function (error) {
                      LoadingService.stopLoading();
                      return onConnectToSaveError(scope, error);
                    });
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