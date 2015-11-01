(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('unsaveModal', function () 
    {
		return {
			restrict: 'E',
			templateUrl: 'partials/unsave.modal.html'
		};     
    });
})();