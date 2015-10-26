/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .service('ImageService', ['$http', '$log', function ($http, $log) 
    {  
       var baseImgPath = 'img/';
       var sufix = '.json';
       
       this.getAvatarImages = function () {   

         return $http.get(baseImgPath + 'avatar/avatar-imgs' + sufix)
           .then(
             function (response) {
               return response.data;
             },
             function (error) {
               $log.error(error);
               return null;
             }
           );
       };
    }]);
})();