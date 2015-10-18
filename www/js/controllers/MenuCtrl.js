/// <reference path='../../libs/typings/angularjs/angular.d.ts'/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('MenuController', ['AuthService', '$scope', '$state', '$window', 'localStorageService',
                          function (AuthService, $scope, $state, $window, localStorageService) {
                
        $scope.$watch(function () { return $state.current.name }, function (newValue, oldValue) {
          if (typeof newValue !== 'undefined') {           
            switch ($state.current.name) {
              case 'app.avatar': 
                $scope.navbarTitle =  $scope.string.navbarTitle.AVATAR; 
                break;
              case 'app.tracking': 
                $scope.navbarTitle = $scope.string.navbarTitle.TRACKING;
                break;
              default: 
                $scope.navbarTitle = $scope.string.APP_NAME;
            }            
          }
        });
        
        if (localStorageService.get('user') === null) {
          $state.go('auth');
        }
        
        this.menuItens = [
          {
            name: $scope.string.menu.HOME,
            icon: 'fa fa-home',
            action: function () {
              $state.go('app.home');
            }
          },
          {
            name: $scope.string.menu.TRACKING,
            icon: 'fa fa-bicycle',
            action: function () {
              $state.go('app.tracking');
            }
          },
          {
            name: $scope.string.menu.AVATAR,
            icon: 'fa fa-user',
            action: function () {
              $state.go('app.avatar');
            }
          },
          {
            name: $scope.string.menu.LOGOUT,
            icon: 'fa fa-sign-out',
            action: function () {
              angular.element('#logoutModal').modal('show');                 
            }
          }
        ];
        
        $scope.doLogout = function() {
          angular.element('#logoutModal').modal('hide');
          angular.element('body').removeClass('modal-open');
          angular.element('.modal-backdrop').remove();
          AuthService.logout();
        };
        
        angular.element('.navmenu').offcanvas({'toggle': false});
        
        angular.element('.navmenu').on('show.bs.offcanvas', function (e) {
          angular.element('#menuContainer').addClass('blur');
        });
        
        angular.element('.navmenu').on('hide.bs.offcanvas', function (e) {
          angular.element('#menuContainer').removeClass('blur');
        });        
        
        $scope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState, fromParams) {  
            angular.element('.navmenu').offcanvas('hide');
            
            if ((localStorageService.get('user') === null) && (toState.name !== 'auth')) {
              event.preventDefault();
              $state.go('auth');
            }
         });      
          
        angular.element($window).bind('resize', function () {
          angular.element('.navmenu').offcanvas('hide');
          angular.element('#menuContainer').removeClass('blur');
          $scope.$apply();
        });        
      }]);
})();