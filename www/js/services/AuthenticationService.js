/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
	'use strict';

	angular.module('Pedal2Play')
	.factory('AuthService', ['$rootScope', '$http', 'localStorageService', '$state', '$q', 'LoadingService',
					function ($rootScope, $http, localStorageService, $state, $q, LoadingService) {
		
		var sucessCallback = function (scope, response, messageOut) {
			if (response.data && 
				response.data.token && 
				response.data.id_user && 
				!response.data.error) 
			{
				delete scope.user.password;
				scope.user.id = response.data.id_user;
				scope.user.token = response.data.token;
				localStorageService.set('user', angular.copy(scope.user));
				$state.go('app.home');
			} else {
				scope.errorMessage = messageOut;
			}
			LoadingService.stopLoading();
		}
		
		var errorCallback = function (scope, error) {
			scope.errorMessage = $rootScope.string.form.message.SERVER_CONNECT_FAIL;
			LoadingService.stopLoading();
		}	
		
		return {		
			signIn: function (scope) {				
				LoadingService.startLoading();
				$http.post($rootScope.string.SERVER_BASE_URL + 'signin', scope.user)
					.then(
						function (response) {
							sucessCallback(scope, 
										   response, 
										   $rootScope.string.form.message.SERVER_SIGN_IN_FAIL);
						},
						function (error) {
							errorCallback(scope, error);
						});		
			},		
			signUp: function (scope) {
				LoadingService.startLoading();
				$http.post($rootScope.string.SERVER_BASE_URL + 'signup', scope.user)
					.then(
						function (response) {
							sucessCallback(scope, 
										   response, 
										   $rootScope.string.form.message.SERVER_SIGN_UP_FAIL);						
						},
						function (error) {
							errorCallback(scope, error);
						});
			},
			isValidEmail: function (email) {
				return $http.get($rootScope.string.SERVER_BASE_URL + 'validateemail/' + email)
					.then(
						function (response) {
							if (response.data) {
								return true;
							}
							return $q.reject();
						},
						function (error) {
							return $q.reject();
						});
			},
			logout: function() {
				localStorageService.remove('user');
				$state.go('auth');
			}
		};
	}]);
})();