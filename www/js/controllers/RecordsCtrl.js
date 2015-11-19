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
    
    var IFRS_LAT = -29.899837
      , IFRS_LGT = -51.1503104
      , MARKER_ID = 0
      , MAP_ZOOM = 17
      , LABEL_COORD = "15 -15"
      ;
    
    $scope.activities = null;
    $scope.selectedActivity = {
      description: ""
      , time: 0
      , speed: 0
      , distance: 0
      , timestamp: 0 
    };
    $scope.mapOptions = {scrollwheel: false};
    
    LoadingService.startLoading();
    TrackService.recoverActivities().then(
      function(userActivities) {
        if (userActivities) {
          $scope.activities = userActivities;
        } else {
          ErrorMessageService.show($scope.string.records.ERROR_NOT_FOUND);
        }
        LoadingService.stopLoading();
      },
      function (error) {
         ErrorMessageService.show($scope.string.records.ERROR_CANT_CONNECT);
         LoadingService.stopLoading();
    });
    
    uiGmapGoogleMapApi.then(function (maps) {
        $scope.map = {
          center: { latitude: IFRS_LAT, longitude: IFRS_LGT }, 
          zoom: MAP_ZOOM,
          marker: {
            id: MARKER_ID,
            coords: { latitude: IFRS_LAT, longitude: IFRS_LGT },
            options: {
              labelContent: "IFRS - Campus Canoas",
              labelAnchor: LABEL_COORD,
              labelClass: "marker-labels"
            }
          }
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
    
    var getActivityLocaleDate = function () {
      if (angular.isUndefined($scope.selectedActivity.timestamp)){
        return null;
      }
      return new Date($scope.getMilliseconds(
                 $scope.selectedActivity.timestamp)).toLocaleString();
    }
    
    var loadActivityPath = function (path) {
      var pathLen = path.length;
      var mapPath = [];
      for (var i = 0; i < pathLen; i++) {
        mapPath.push({latitude: path[i].latitude, longitude: path[i].longitude});
      }
      
      uiGmapGoogleMapApi.then(function (maps) {        
        delete $scope.map;
        $scope.map = { 
          center: { latitude: path[0].latitude, longitude: path[0].longitude }, 
          zoom: MAP_ZOOM,
          stroke: { color: "#a63ab7", weight: 4, opacity: 1.0 },
          path: mapPath, 
          marker: {
            id: MARKER_ID,
            coords: { latitude: path[0].latitude, longitude: path[0].longitude },
            options: {
              labelContent: $scope.selectedActivity.description + " - " + 
                            getActivityLocaleDate(),
              labelAnchor: LABEL_COORD,
              labelClass: "marker-labels"
            }
          }
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
              $scope.selectedActivity.description = activity.description;
              $scope.selectedActivity.timestamp = activity.timestamp;
              $scope.selectedActivity.time = activity.timer;
              $scope.selectedActivity.distance = calculateDistance(path);
              $scope.selectedActivity.speed = calculateAverageSpeed(
                  $scope.selectedActivity.distance, ($scope.selectedActivity.time / 1000)
              );
              loadActivityPath(path);
           } else {
             ErrorMessageService.show($scope.string.records.ERROR_CANT_GET_PATH);
           }
           LoadingService.stopLoading();           
        },
        function (error) {
          ErrorMessageService.show($scope.string.records.ERROR_CANT_GET_PATH);
          LoadingService.stopLoading();
        });      
    }
     
    $scope.$on('$destroy', function () {
        ErrorMessageService.stopShowing()
    }); 
        
  }]);
  
})();