(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('trackingModal', function () 
    {
		return {
			restrict: 'E',
			templateUrl: 'partials/tracking.modal.html'
		};     
    });
})();