/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('HomeController', ['$scope', 'localStorageService', function ($scope, localStorageService) 
    {
       $scope.user = localStorageService.get('user');
    }]);
})();