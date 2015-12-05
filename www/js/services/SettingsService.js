(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('SettingsService', ['localStorageService', 
				 	             function (localStorageService) { 
									          		  
		  return {
			getUserSettings: function () {
				var user = localStorageService.get('user');
				if (user !== null) {
					return localStorageService.get('settings' + user.id);
				}   
				return {language: 'pt-BR'};
			},
			setUserSettings: function (settings) {
				var user = localStorageService.get('user');
				if (user !== null) {
					localStorageService.set('settings' + user.id, settings);
				}
			}
		};
    }]);
})();