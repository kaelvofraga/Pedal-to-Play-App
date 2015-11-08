(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .service('ImageService', ['$http', '$q', function ($http, $q) { 
                               
       var BASE_IMG_PATH = 'img/';
       var SUFIX = '.json';
       var self = this;
       
       this.avatarImages = null;
       
       this.getAvatarImages = function () {   
         
         var deferred = $q.defer();

         if (self.avatarImages) {
           deferred.resolve(self.avatarImages);
         } else {
           $http.get(BASE_IMG_PATH + 'avatar/avatar-imgs' + SUFIX)
             .then(
               function (response) {
                 self.avatarImages = response.data;
                 deferred.resolve(response.data);
               },
               function (error) {
                 deferred.reject(null);
             });
         }
         
         return deferred.promise;
       };
       
    }]);
    
})();