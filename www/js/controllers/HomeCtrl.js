/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('HomeController', ['$scope', 'AuthService', 
                          function ($scope, AuthService) 
    {
       $scope.user = AuthService.getLoggedUser();
    }]);
})();