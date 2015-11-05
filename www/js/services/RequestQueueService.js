(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('RequestQueueService', ['CordovaMainService', 'localStorageService', '$http', '$q',
                            function (CordovaMainService, localStorageService, $http, $q) {                        
        var self = this;
        
        this.popRequest = function () {
            var deferred = $q.defer();
            var requests = [];
            var user = localStorageService.get('user');
            if (user !== null) {
                requests = localStorageService.get('requests' + user.id);
                if ((requests !== null) && (requests.length > 0)) {
                    $http(requests.pop()).then(
                        function (response) {
                            localStorageService.set('requests' + user.id, requests);
                            deferred.resolve(true);
                            self.popRequest();
                        },
                        function (error) {
                            localStorageService.set('requests' + user.id, requests);
                            deferred.reject(false);
                        });
                } else {
                    deferred.reject(false);
                }
            } else {
                deferred.reject(false);
            }
            return deferred.promise;
        }
        
        this.pushRequest = function (request) {
            var requests = null;
            var user = localStorageService.get('user');
            if (user !== null) {
                requests = localStorageService.get('requests' + user.id);
                if (requests === null) {
                    requests = [];
                }
                requests.push(request);
                localStorageService.set('requests' + user.id, requests);
            }
        }
        
        return {
           pushRequest: self.pushRequest,           
           popRequest: self.popRequest
        };
    }]);
})();