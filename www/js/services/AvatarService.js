/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('AvatarService', ['$rootScope', '$http', 'localStorageService', 'LoadingService',
                      function ($rootScope, $http, localStorageService, LoadingService) {
        
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
        
        var onConnectToGetSuccess = function (response) {
          if (response.data && response.data.error) {
            return searchLocally();
          }
          saveLocally(response.data);
          return response.data;
        }
        
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
          return $http.get($rootScope.string.SERVER_BASE_URL + 'avatar')
                  .then(
                    function (response) {
                      return onConnectToGetSuccess(response);
                    },
                    function (error) {
                      return searchLocally();
                    });
        };
        
        return {            
            recoverCustomization: function () {
                return searchRemotely();
            },
            
            saveCustomization: function (avatar) {
              return saveRemotely(avatar);
            }
        };
      }]);
})();