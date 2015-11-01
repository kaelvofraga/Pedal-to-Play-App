(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('TrackingController', ['$scope', 'TrackService', function ($scope, TrackService) 
    {
      var intervalId = setInterval(function () {
        TrackService.getCurrentPosition(function (position) {
          $scope.position = [
            { 
              name: $scope.string.position.LATITUDE, 
              value: position.coords.latitude 
            },
            { 
              name: $scope.string.position.LONGITUDE, 
              value: position.coords.longitude 
            },
            { 
              name: $scope.string.position.ALTITUDE,
              value: position.coords.altitude 
            },
            {
              name: $scope.string.position.ACCURACY, 
              value: position.coords.accuracy 
            },
            { 
              name: $scope.string.position.ALTITUDE_ACCURACY, 
              value: position.coords.altitudeAccuracy 
            },
            { 
              name: $scope.string.position.HEADING, 
              value: position.coords.heading 
            },
            { 
              name: $scope.string.position.SPEED, 
              value: position.coords.speed 
            },
            { 
              name: $scope.string.position.TIMESTAMP, 
              value: position.coords.timestamp
            }
          ];
        });
      }, 1000);
      
      $scope.$on('$destroy', function () {
        clearInterval(intervalId);
      });      
    }]);
})();