(function () {
'use strict';

angular.module('Pedal2Play')
.controller('RecordsController', [
  '$scope'
  , 'uiGmapGoogleMapApi'
  , 'TrackService'
  , 'ErrorMessageService'
  , 'LoadingService'
  , function ($scope
            , uiGmapGoogleMapApi
            , TrackService
            , ErrorMessageService
            , LoadingService) {
    
    $scope.activities = null;
    $scope.errorMsg = ErrorMessageService;
    $scope.selectedActivity = {};
    $scope.selectedActivity.time = 0;
    $scope.selectedActivity.speed = 0;
    $scope.selectedActivity.distance = 0;   
    
    LoadingService.startLoading();
    TrackService.recoverActivities().then(
      function(userActivities) {
        if (userActivities) {
          $scope.activities = userActivities;
        } else {
          $scope.errorMsg.show($scope.string.records.ERROR_NOT_FOUND);
        }
        LoadingService.stopLoading();
      },
      function (error) {
         $scope.errorMsg.show($scope.string.records.ERROR_CANT_CONNECT);
         LoadingService.stopLoading();
    });
    
    uiGmapGoogleMapApi.then(function (maps) {
        $scope.map = {
          center: { latitude: -29.899837, longitude: -51.1503104 }, 
          zoom: 16
        };
    });
        
    var calculateDistance = function (path) {
      var totalMeters = 0;
      var pathLen = path.length;
      for (var i = 0; i < pathLen - 1; i++) {
        totalMeters += TrackService.calcDistanceBetweenCoords(
                          path[i].latitude, path[i].longitude,
                          path[i + 1].latitude, path[i + 1].longitude);
      }

      return totalMeters;
    }
    
    var calculateAverageSpeed = function (metres, seconds) {
      var metresPerSeg = (metres / seconds) || 0;
      return metresPerSeg * 3.6; // convert to km/h
    }   
    
    var loadActivityPath = function (path) {
      var pathLen = path.length;
      var mapPath = [];
      for (var i = 0; i < pathLen; i++) {
        mapPath.push({latitude: path[i].latitude, longitude: path[i].longitude});
      }
      
      uiGmapGoogleMapApi.then(function (maps) {
        $scope.map = { 
          center: { latitude: path[0].latitude, longitude: path[0].longitude }, 
          zoom: 15,
          stroke: { color: "#a63ab7", weight: 4, opacity: 1.0 },
          path: mapPath 
        };
      });
    }   
    
    $scope.getDistanceInKm = function () {
      return $scope.selectedActivity.distance / 1000;
    }
    
    $scope.getMilliseconds = function (seconds) {
      return seconds * 1000;
    }
     
    $scope.onClickActivity = function (activity) {
      LoadingService.startLoading();
      TrackService.recoverActivityPath(activity.id).then(
        function (path) {
           if (path) {
              $scope.selectedActivity.time = activity.timer;
              $scope.selectedActivity.distance = calculateDistance(path);
              $scope.selectedActivity.speed = calculateAverageSpeed(
                  $scope.selectedActivity.distance, ($scope.selectedActivity.time / 1000)
              );
              loadActivityPath(path);
           } else {
             $scope.errorMsg.show($scope.string.records.ERROR_CANT_GET_PATH);
           }
           LoadingService.stopLoading();           
        },
        function (error) {
          $scope.errorMsg.show($scope.string.records.ERROR_CANT_GET_PATH);
          LoadingService.stopLoading();
        });      
    }
     
    $scope.$on('$destroy', function () {
        $scope.errorMsg.stopShowing()
    }); 
        
  }]);
  
})();