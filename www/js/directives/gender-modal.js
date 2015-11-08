(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('genderModal', function () 
    {
      return {
        restrict: 'E',
        templateUrl: 'partials/gender.modal.html'
      };     
    });
})();