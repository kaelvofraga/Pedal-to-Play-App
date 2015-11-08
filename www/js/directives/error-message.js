(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .directive('errorMessage', ['ErrorMessageService', 
                       function (ErrorMessageService) { 
      return {
        restrict: 'E',
        templateUrl: 'partials/error-message.html',
        link: function(scope, element, attrs, tabsCtrl) {
          scope.errorMsg = ErrorMessageService;
        },
      };     
    }]);
})();