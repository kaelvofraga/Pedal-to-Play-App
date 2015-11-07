(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('ErrorMessageService', ['$timeout', function ($timeout) 
    {   
        this.errorMsgTimeout = undefined;
        this.shownMessage = false;
        this.message = "";
        var self = this;
                                        
        return {
            getMessage: function () {
                return self.message;
            },
            hasMessage: function () {
                return self.shownMessage;
            },
            show: function (message) {
                self.message = message;
                self.shownMessage = true;
                self.errorMsgTimeout = $timeout(function () {
                    self.shownMessage = false;
                }, 30000);
            },
            stopShowing: function () {
                if (angular.isDefined(self.errorMsgTimeout)) {
                    $timeout.cancel(self.errorMsgTimeout);
                    self.shownMessage = false;
                }
            }
        };
    }]);
})();