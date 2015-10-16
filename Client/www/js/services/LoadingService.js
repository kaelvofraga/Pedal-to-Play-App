/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('LoadingService', ['$rootScope', function ($rootScope) 
    {   
        $rootScope.loading = false;
        
        $rootScope.$on('startLoading', function () {
            $rootScope.loading = true;
        });

        $rootScope.$on('stopLoading', function () {
            $rootScope.loading = false;
        });
                     
        return {
            startLoading: function() {
                $rootScope.$emit('startLoading');
            },
            stopLoading: function() {
                $rootScope.$emit('stopLoading');
            }
        };
    }]);
})();