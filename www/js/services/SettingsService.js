(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .factory('SettingsService', ['localStorageService', 
				 	             function (localStorageService) { 
		
		  var defaultSetting = {language: 'pt-BR'};
										          		  
		  return {
			getUserSettings: function () {
				var user = localStorageService.get('user');
				if (user !== null) {
					return localStorageService.get('settings' + user.id) || defaultSetting;
				}   
				return defaultSetting;
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