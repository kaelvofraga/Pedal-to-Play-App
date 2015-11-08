(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('QuestsController', [
        '$scope'
      , 'ImageService'
      , 'ProfileService'
      , 'LoadingService'
      , 'ErrorMessageService'
      , function ($scope
                , ImageService
                , ProfileService
                , LoadingService
                , ErrorMessageService) {
               
        LoadingService.startLoading();
        ProfileService.getUserLevel().then(
          function (level) {
            ImageService.getAvatarImages().then(function (rewards) {
              $scope.userLevel = level;
              $scope.rewards = rewards.rewards;
              LoadingService.stopLoading();
            });
          }, 
          function (error) {
            LoadingService.stopLoading();
            ErrorMessageService.show($scope.string.quests.ERROR_CONNECTION);
        });
        
        $scope.areQuestsToShow = function () {
          return angular.isDefined($scope.userLevel) && 
                 angular.isDefined($scope.rewards)
        }
        
         
        $scope.getQuestClass = function(questLevel) {
          if (angular.isDefined($scope.userLevel) && questLevel) {          
            if (questLevel < $scope.userLevel) {
              return {
                bootstrapClass: 'panel-success', 
                status: $scope.string.quests.COMPLETED
              };
            } else if (questLevel > $scope.userLevel) {
              return {
                bootstrapClass: 'panel-default', 
                status: $scope.string.quests.UNAVAILABLE
              };
            }
          }
          return {
                bootstrapClass: 'panel-primary', 
                status: $scope.string.quests.IN_PROGRESS
              };
        }

        $scope.$on('$destroy', function () {
          ErrorMessageService.stopShowing();
        }); 
           
    }]);
    
})();