(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('logoutModal', function () 
    {
      return {
        restrict: 'E',
        templateUrl: 'partials/logout.modal.html'
      };     
    });
})();