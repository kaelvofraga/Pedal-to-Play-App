/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .service('StringService', function($http) {  
        this.getStrings = function(scope, language) {
            var lang = language || 'pt-BR';
            var languageFilePath = 'languages/' + lang + '.lang.json';           
            
            $http.get(languageFilePath).success(function (data) {
                scope.string = data;
            });
        };
    });
})();