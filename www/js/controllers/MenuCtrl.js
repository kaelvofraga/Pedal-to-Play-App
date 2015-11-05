(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('MenuController', ['AuthService', '$scope', '$state', '$window',
                          function (AuthService, $scope, $state, $window) {
                
        if (AuthService.getLoggedUser() === null) {
          $state.go('auth');
        }        
       
        var sideMenu = angular.element('.navmenu');                
        
        sideMenu.offcanvas({'toggle': false});        
        
        sideMenu.on('show.bs.offcanvas', function (e) {
          angular.element('#menuContainer').addClass('blur');
        });        
        
        sideMenu.on('hide.bs.offcanvas', function (e) {
          angular.element('#menuContainer').removeClass('blur');
        });
            
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

        $scope.hideModal = function (idModal) {
          var modalObj = angular.element(idModal);
          if (modalObj) {
            modalObj.modal('hide');
          }
          angular.element('body').removeClass('modal-open');
          angular.element('.modal-backdrop').remove();
        }
        
        $scope.doLogout = function() {
          $scope.hideModal('#logoutModal');
          AuthService.logout();
        };        
                                
        $scope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState, fromParams) {  
            sideMenu.offcanvas('hide');
            
            if ((AuthService.getLoggedUser() === null) && (toState.name !== 'auth')) {
              event.preventDefault();
              $state.go('auth');
            }
         });      
          
        angular.element($window).bind('resize', function () {
          sideMenu.offcanvas('hide');
        });                     
    }]);
})();