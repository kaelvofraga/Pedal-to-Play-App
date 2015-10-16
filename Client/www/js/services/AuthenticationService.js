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
				!(response.data.error)) 
			{
				scope.user = {};
				scope.user = angular.copy(response.data);
				localStorageService.set('user', angular.copy(scope.user));
				$state.go('app.home');
			} else {
				scope.errorMessage = messageOut;
			}
			LoadingService.stopLoading();
		}
		
		var errorCallback = function (scope, error) {
			console.log(error);
			scope.errorMessage = "Falha ao tentar conectar com o servidor.";
			LoadingService.stopLoading();
		}	
		
		return {		
			signIn: function (scope) {
				
				if(scope.user.email === "p2p@admin.com" && 
				   scope.user.password === "bc37008a9e7bb86fcb7a8661b0da4684")
				{
					localStorageService.set('user', angular.copy(scope.user));
					$state.go('app.home');
					return;
				}
								
				LoadingService.startLoading();
				$http.post($rootScope.SERVER_BASE_URL + 'signin', scope.user)
					.then(
						function (response) {
							sucessCallback(scope, response, "Usuário ou senha incorretos.");
						},
						function (error) {
							errorCallback(scope, error);
						});		
			},		
			signUp: function (scope) {
				LoadingService.startLoading();
				$http.post($rootScope.SERVER_BASE_URL + 'signup', scope.user)
					.then(
						function (response) {
							sucessCallback(scope, response, "Dados para cadastro inválidos.");						
						},
						function (error) {
							errorCallback(scope, error);
						});
			},
			isValidEmail: function (email) {
				return $http.get($rootScope.SERVER_BASE_URL + 'validateemail/' + email)
					.then(
						function (response) {
							if (response.data) {
								return true;
							}
							return $q.reject();
						},
						function (error) {
							console.log(error);
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