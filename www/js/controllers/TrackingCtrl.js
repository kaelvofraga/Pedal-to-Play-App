(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('TrackingController', ['$scope', '$interval','TrackService', 'ErrorMessageService',
                              function ($scope, $interval, TrackService, ErrorMessageService) {
      
      var MIN_SESSION_LEN = 30
        , MAX_ERRORS = 10
        ;
      
      var sessionID = null
        , sessionData = []
        , timer = null
        ;
                                       
      var resetValues = function () {
        $scope.time = 0;
        $scope.speed = 0;
        $scope.distance = 0;
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
        }
      }

      var locationOptions = { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true };
      
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
        if (sessionID !== null) {
          clearInterval(sessionID);
        } 
        if (timer) {
          $interval.cancel(timer);
        }
      }  
      
      $scope.onStartTracking = function () {                         
        $scope.hideModal('#trackingModal');
        $scope.state = 'tracking';

        if (timer) {
          $interval.cancel(timer);
        }

        timer = $interval(function () {
          $scope.time += 1000;
        }, 1000);

        if (sessionID) {
          clearInterval(sessionID);
        }

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
        }, 5000);                                    
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
        if (activity.description.length <= 100) {
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
        if (sessionID) {
          clearInterval(sessionID);
        } 
        if (timer) {
          $interval.cancel(timer);
        } 
        $scope.hideModal('#trackingModal');
      });     
    }]);
})();