(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('SettingsController', [
        '$scope'
      , '$rootScope'
      , '$window'
      , 'StringService'
      , 'SettingsService'
      , function ($scope
                , $rootScope
                , $window
                , StringService
                , SettingsService) {
           
      $scope.changeLanguage = function (lang) {
        if (SettingsService.getUserSettings().language !== lang) {
          StringService.getStrings($rootScope, lang);
          SettingsService.setUserSettings({language: lang});
          $window.location.reload();
        }
      }  
      
    }]);
})();