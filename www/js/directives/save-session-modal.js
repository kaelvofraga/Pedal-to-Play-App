(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('saveSessionModal', function () 
    {
		return {
			restrict: 'E',
			templateUrl: 'partials/save-session.modal.html'
		};     
    });
})();