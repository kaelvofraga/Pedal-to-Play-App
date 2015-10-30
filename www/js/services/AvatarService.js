/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('AvatarService', ['$rootScope', '$http', 'localStorageService', 'LoadingService',
                      function ($rootScope, $http, localStorageService, LoadingService) {
        
        var onConnectToSaveSuccess = function (avatar, response) {
          if (response.data && response.data.error) {
             return false;
          }
          saveLocally(avatar);
          return true;
        }

        var onConnectToSaveError = function (avatar, error) {
            //TODO pull request in the queue
            saveLocally(avatar);
            return true;
        }
        
        var saveLocally = function (avatar) {
          var user = localStorageService.get('user');
          if (user !== null) {
            localStorageService.set('avatar' + user.id, angular.copy(avatar));          
          }
        };
            
        var searchLocally = function () {
          var user = localStorageService.get('user');
          return user !== null ? localStorageService.get('avatar' + user.id) : null;
        };
  
        var saveRemotely = function (avatar) {
          LoadingService.startLoading();
          return $http.put($rootScope.string.SERVER_BASE_URL + 'avatar', avatar)
                  .then(
                    function (response) {
                      LoadingService.stopLoading();
                      return onConnectToSaveSuccess(avatar, response);
                    },
                    function (error) {
                      LoadingService.stopLoading();
                      return onConnectToSaveError(avatar, error);
                    });
        };
  
        var searchRemotely = function () {
          return null;
        };
        
        return {            
            recoverCustomization: function () {
              var avatarCustomization = searchRemotely();
              if (avatarCustomization === null) {
                return searchLocally();
              }
            },
            
            saveCustomization: function (avatar) {
              return saveRemotely(avatar);
            }
        };
      }]);
})();