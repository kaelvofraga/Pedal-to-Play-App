/// <reference path="../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';

  angular.module('Pedal2Play', [
    'ui.router', 
    'ngMd5', 
    'LocalStorageModule', 
    'ngTouch'
  ]) 
  
  .controller('MainController', ['$rootScope', 'StringService', 
                        function ($rootScope, StringService) {    
      StringService.getStrings($rootScope, null);                          
  }])
      
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
      .state('auth', {
          url: '/auth',
          templateUrl: 'partials/authentication.html',
          controller: 'AuthController',
          controllerAs: 'authCtrl'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'partials/menu.html',
        controller: 'MenuController',
        controllerAs: 'menuCtrl'
      })
      .state('app.home', {
        url: '/home',
        templateUrl: 'partials/menu.home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'        
      })
      .state('app.avatar', {
        url: '/avatar',
        templateUrl: 'partials/menu.avatar.html',
        controller: 'AvatarController',
        controllerAs: 'avatarCtrl'        
      })
      .state('app.tracking', {
        url: '/tracking',
        templateUrl: 'partials/menu.tracking.html',
        controller: 'TrackingController',
        controllerAs: 'trackCtrl'
      });
    
    $urlRouterProvider.otherwise('/app/home');
    
    $httpProvider.interceptors.push(['$q', '$location', 'localStorageService', 
                            function ($q, $location, localStorageService) {
      return {
        'request': function (config) {
            config.headers = config.headers || {};
            var user = localStorageService.get('user');
            if (user !== null) {
              config.headers.Authorization = angular.toJson({
                'id': user.id,
                'token': user.token
              });
              config.withCredentials = true;
            }
            return config;
        },
        'responseError': function (response) {
            if (response.status === 401) {
              if (localStorageService.get('user')) {
                localStorageService.remove('user');
              }
              $location.path('/auth');
            }
            return $q.reject(response);
        }
      };
    }]);    
  });
})();