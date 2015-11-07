(function () { 
	'use strict';

  angular.module('Pedal2Play').factory('TrackService', [
      '$rootScope'
    , '$http'
    , '$q'
    , 'CordovaMainService'
    , 'LoadingService'
    , 'NetworkService'
    , 'RequestQueueService'
    , 'localStorageService'
    , function ($rootScope
              , $http
              , $q
              , CordovaMainService
              , LoadingService
              , NetworkService
              , RequestQueueService
              , localStorageService) {
    
    var cordovaGetCurrentPosition = function (onSuccess, onError, options) {
      navigator.geolocation.getCurrentPosition(
        function () {
          var that = this, args = arguments;

          if (onSuccess) {
            $rootScope.$apply(function () {
              onSuccess.apply(that, args);
            });
          }
        },
        function () {
          var that = this, args = arguments;

          if (onError) {
            $rootScope.$apply(function () {
              onError.apply(that, args);
            });
          }
        },
        options);
    }    
    
    var cordovaIsLocationEnabled = function (onSuccess, onError) {      
      cordova.plugins.diagnostic.isLocationEnabled(
        function () {
          var that = this, args = arguments;

          if (onSuccess) {
            $rootScope.$apply(function () {
              onSuccess.apply(that, args);
            });
          }
        },
        function () {
          var that = this, args = arguments;

          if (onError) {
            $rootScope.$apply(function () {
              onError.apply(that, args);
            });
          }
        }
      );
    }    
    
    var isValidActivity = function (activity) {
      var ngIsNumber = angular.isNumber;
      var ngIsDef = angular.isDefined;
      if (activity &&
          ngIsDef(activity.description) &&
          ngIsDef(activity.timer) &&
          ngIsDef(activity.path)
      ) {
        if (ngIsNumber(activity.timer) && 
            angular.isArray(activity.path)
        ) {
          angular.forEach(activity.path, function (position, key) {
            if (!ngIsNumber(position.timestamp) || 
                !ngIsNumber(position.coords.latitude) ||
                !ngIsNumber(position.coords.longitude) ||
                ((position.coords.speed !== null) && !ngIsNumber(position.coords.speed))
            ) {
              return false;
            }
          });
          return true;              
        }  
      }
      return false;
    }
    
    var onConnectToSaveSuccess = function (response) {
      if (response.data && !(response.data.error)) {
        RequestQueueService.popRequest().then(
          function (result) {
            LoadingService.stopLoading();            
          },
          function (error) {
            LoadingService.stopLoading();            
          });
        return true;
      }
      LoadingService.stopLoading();
      return false;      
    }

    var onConnectToSaveError = function (request, error) {
      RequestQueueService.pushRequest(request);
      return true;
    }

    var saveRemotely = function (request, deferred) {
      LoadingService.startLoading();
      
      $http(request).then(
          function (response) {
            deferred.resolve(onConnectToSaveSuccess(response));
          },
          function (error) {
            LoadingService.stopLoading();
            deferred.reject(onConnectToSaveError(request, error));
          });
    };
    
    return {
      getCurrentPosition: CordovaMainService.cordovaReady(cordovaGetCurrentPosition),
      
      isLocationEnabled: CordovaMainService.cordovaReady(cordovaIsLocationEnabled),
      
      calcDistanceBetweenCoords: function (lat1, lon1, lat2, lon2) {        
        /* From "Calculate distance, bearing and more between Latitude/Longitude points" (VENESS, 2015)   
           http://www.movable-type.co.uk/scripts/latlong.html */    
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
      },
      
      recoverActivityPath: function (activityID) {
        
        return $http.get($rootScope.string.SERVER_BASE_URL + 'activity/' + activityID)
          .then(
            function (response) {
              if (response.data && response.data.error) {
                return null;
              }
              return response.data;
            },
            function (error) {
              return null;
            });        
      },
      
      recoverActivities: function () {
        
        return $http.get($rootScope.string.SERVER_BASE_URL + 'activities')
          .then(
            function (response) {
              if (response.data && response.data.error) {
                return null;
              }
              return response.data;
            },
            function (error) {
              return null;
            });        
      },

      saveActivity: function (activity) {
        
        var deferred = $q.defer();
        
        var request = {
          method: 'POST',
          url: $rootScope.string.SERVER_BASE_URL + 'activity',
          data: activity
        }
        
        if (isValidActivity(activity) === false) {
          deferred.resolve(false);
        } else if (NetworkService.isConnected()) {
          saveRemotely(request, deferred);          
        } else {
          RequestQueueService.pushRequest(request);
          deferred.resolve(true);
        }            
        
        return deferred.promise; 
      }           
    };
  }]);    
})();