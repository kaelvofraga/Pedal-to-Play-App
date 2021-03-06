(function () { 
  'use strict';

  angular.module('Pedal2Play', [
      'ui.router' 
    , 'ngMd5' 
    , 'LocalStorageModule'
    , 'ngTouch'
    , 'uiGmapgoogle-maps'
  ]) 
  
  .controller('MainController', [
      '$rootScope'
    , 'StringService'
    , 'AuthService'
    , '$state'
    , 'SettingsService'
    , function ($rootScope
              , StringService
              , AuthService
              , $state
              , SettingsService) {    
      
      StringService.getStrings($rootScope, SettingsService.getUserSettings().language);  
      
      $rootScope.$on('$locationChangeStart', function (event, newUrl) {
        var next = newUrl.split('#')[1];
        if ((next !== '/auth') && (AuthService.getLoggedUser() === null)) {              
            event.preventDefault();
            $state.go('auth');
        }
      });                              
  }])
      
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, uiGmapGoogleMapApiProvider) {

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
        controller: 'AvatarController',
        controllerAs: 'avatarCtrl'        
      })
      .state('app.avatar', {
        url: '/avatar',
        templateUrl: 'partials/menu.avatar.html',
        controller: 'AvatarController',
        controllerAs: 'avatarCtrl'        
      })
      .state('app.quests', {
        url: '/quests',
        templateUrl: 'partials/menu.quests.html',
        controller: 'QuestsController',
        controllerAs: 'questsCtrl'        
      })
      .state('app.tracking', {
        url: '/tracking',
        templateUrl: 'partials/menu.tracking.html',
        controller: 'TrackingController',
        controllerAs: 'trackCtrl'
      })
      .state('app.records', {
        url: '/records',
        templateUrl: 'partials/menu.records.html',
        controller: 'RecordsController',
        controllerAs: 'recCtrl'
      })
      .state('app.settings', {
        url: '/settings',
        templateUrl: 'partials/menu.settings.html',
        controller: 'SettingsController',
        controllerAs: 'settCtrl'
      })
      ;
    
    $urlRouterProvider.otherwise('/app/home');
    
    uiGmapGoogleMapApiProvider.configure({
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
    
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