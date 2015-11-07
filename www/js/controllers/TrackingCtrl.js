(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('TrackingController', [
      '$scope'
    , '$interval'
    , '$timeout'
    , 'TrackService'
    , 'ErrorMessageService'
    , 'uiGmapGoogleMapApi'
    , function ($scope
              , $interval
              , $timeout
              , TrackService
              , ErrorMessageService
              , uiGmapGoogleMapApi) {
      
      var MIN_SESSION_LEN = 30
        , MAX_ERRORS = 10
        , LOCATION_TIMEOUT = 10000
        , LOCATION_MAXAGE = 60000
        , LOCATION_INTERVAL = 5000
        , TRY_AGAIN = 30000
        , ONE_SECOND = 1000
        ;
      
      var sessionID = null
        , sessionData = []
        , timer = null
        , tryAgainTimeout = null
        ;
                                       
      var resetValues = function () {
        $scope.time = 0;
        $scope.speed = 0;
        $scope.distance = 0;
        $scope.MAX_DESC_LENGTH = 40;
        $scope.state = null;
        $scope.areButtonsLocked = true;
        $scope.sessionDescription = '';
        $scope.errorMsg = ErrorMessageService;
        $scope.errorCounter = 0;
        
        sessionID = null;
        sessionData.splice(0, sessionData.length);       
      }      
      resetValues();
     
      var filterPosition = function (position) {
        delete position.coords.accuracy;
        delete position.coords.altitude;
        delete position.coords.altitudeAccuracy;
        delete position.coords.heading;

        return position;
      }
      
      var updateDistance = function () {
         var dataLen = sessionData.length;         
         if (sessionID && (dataLen >= 2)) {
            var lastOldPosition = sessionData[dataLen - 2].coords;
            var newerPosition = sessionData[dataLen - 1].coords;
            var metres = TrackService.calcDistanceBetweenCoords(
                            lastOldPosition.latitude, lastOldPosition.longitude,
                            newerPosition.latitude, newerPosition.longitude
                         );
            $scope.distance += metres / 1000; 
         }       
      }
      
      var updateSpeed = function () {
        var dataLen = sessionData.length;
        if (sessionID && (dataLen > 0)) {
          var speed = sessionData[dataLen - 1].coords.speed || 0;
          
          $scope.speed = speed * 3.6; 
        }
      }
      
      var onLocationSuccess = function (position) {
        sessionData.push(filterPosition(position));
        updateDistance();
        updateSpeed();
      }

      var onLocationError = function (error) {
        ++($scope.errorCounter);
        if ($scope.errorCounter > MAX_ERRORS) {
          $scope.onPauseTracking();
          $scope.errorMsg.show($scope.string.tracking.GPS_OFF);
          $scope.errorCounter = 0;
          tryAgainTimeout = $timeout(function () {
            $scope.onStartTracking();
          }, TRY_AGAIN);
        }
      }

      var locationOptions = { maximumAge: LOCATION_MAXAGE, timeout: LOCATION_TIMEOUT, enableHighAccuracy: true };
      
      var stopAllIntervals = function () {
        if (sessionID) {
          clearInterval(sessionID);
        } 
        if (timer) {
          $interval.cancel(timer);
        }
        if (tryAgainTimeout) {
          $timeout.cancel(tryAgainTimeout);
        }
      }
      
      $scope.hasMinSessionData = function () {
        return sessionData.length > MIN_SESSION_LEN;
      }
            
      $scope.getLockClass = function () {
        return $scope.areButtonsLocked ? 'btn-primary' : 'btn-default';
      }
      
      $scope.isPaused = function () {
        return $scope.state === 'paused';
      }
 
      $scope.onPauseTracking = function () {
        $scope.state = 'paused';
        stopAllIntervals();
      }  
      
      $scope.onStartTracking = function () {                         
        $scope.hideModal('#trackingModal');
        $scope.state = 'tracking';        
        stopAllIntervals();
                
        timer = $interval(function () {
          $scope.time += ONE_SECOND;
        }, ONE_SECOND);
        
        sessionID = setInterval(function () {
          TrackService.isLocationEnabled(
            function (enabled) {
              if (enabled) {
                TrackService.getCurrentPosition(onLocationSuccess, onLocationError, locationOptions);
              } else {
                $scope.errorMsg.show($scope.string.tracking.GPS_OFF);
                $scope.onPauseTracking();
              }
            }
          );
        }, LOCATION_INTERVAL);                                    
      }          
      
      $scope.onStopTracking = function () {
        $scope.onPauseTracking();
        angular.element('#trackingModal').modal('show');
      }
      
      $scope.onChangeButtonState = function () {
        $scope.areButtonsLocked = !$scope.areButtonsLocked;
      }
      
      $scope.discardSession = function () {
        resetValues();
        $scope.hideModal('#trackingModal');
      }
      
      $scope.saveSession = function () {
        $scope.hideModal('#trackingModal');
        var activity = {
          description: $scope.sessionDescription,
          path: sessionData,
          timer: $scope.time
        }
        if (activity.description.length <= $scope.MAX_DESC_LENGTH) {
          if (sessionData.length > MIN_SESSION_LEN) {
            TrackService.saveActivity(activity)
              .then(function (result) {
                  if (result) {
                    resetValues();
                  } else {
                    $scope.errorMsg.show($scope.string.tracking.ERROR_INVALID_DATA);
                  }
                },
                function (error) {
                  resetValues();
                });            
          }
        } else {
          $scope.errorMsg.show($scope.string.tracking.MAX_LENGTH);
        }       
      }
           
      $scope.$on('$destroy', function () {
        stopAllIntervals();
        $scope.errorMsg.stopShowing()
        $scope.hideModal('#trackingModal');
      });     
    }]);
})();