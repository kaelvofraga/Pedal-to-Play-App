(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .service('StringService', ['$http', function ($http) 
    {   
        this.getStrings = function(scope, language) {
            var lang = language || 'pt-BR';
            var baseLanguagePath = 'languages/';
            var sufix = '.lang.json';        
            
            $http.get(baseLanguagePath + lang + sufix)
                .then(
                    function (response) {
                        scope.string = response.data;
                    }
                );
            
            $http.get(baseLanguagePath + 'common' + sufix)
                .then(
                    function (response) {
                        angular.merge(scope.string, response.data);
                    }
                );
        };
    }]);
})();

  
        
   