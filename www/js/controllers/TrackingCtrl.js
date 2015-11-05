(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('TrackingController', ['$scope', '$log', '$interval', 'localStorageService', 'TrackService', 'ErrorMessageService',
                              function ($scope, $log, $interval, localStorageService, TrackService, ErrorMessageService) {
      
      var MIN_SESSION_LEN = 30;
      
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
        
        sessionID = null;
        sessionData.splice(0, sessionData.length);       
      }      
      resetValues();
     
      /* From "Calculate distance, bearing and more between Latitude/Longitude points" (VENESS, 2015)   
         http://www.movable-type.co.uk/scripts/latlong.html */
      var calcDistanceBetweenCoords = function (lat1, lon1, lat2, lon2) {        
          
        var R = 6371000; // metres
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        lat1 = lat1 * (Math.PI / 180);
        lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
      }
     
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
            var metres = calcDistanceBetweenCoords(lastOldPosition.latitude, lastOldPosition.longitude,
                                                   newerPosition.latitude, newerPosition.longitude);
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
        $log.error('Error: code: ' + error.code + '| message: ' + error.message + '\n');
      }

      var locationOptions = { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true };
      
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
            },
            function (error) {
              $log.error('Error: ' + error + '\n');
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
          path: sessionData
        }
        if (activity.description.length <= 100) {
          if (sessionData.length > MIN_SESSION_LEN) {
            localStorageService.set('activity' + (new Date().getTime()).toString(), activity);
            //TODO save remotely
            resetValues();
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