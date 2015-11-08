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
          if (angular.isDefined(newValue)) {           
            switch ($state.current.name) {
              case 'app.avatar': 
                $scope.navbarTitle =  $scope.string.menu.AVATAR; 
                break;
              case 'app.quests': 
                $scope.navbarTitle =  $scope.string.menu.QUESTS; 
                break;
              case 'app.tracking': 
                $scope.navbarTitle = $scope.string.menu.TRACKING;
                break;
              case 'app.records': 
                $scope.navbarTitle = $scope.string.menu.RECORDS;
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
            name: $scope.string.menu.QUESTS,
            icon: 'fa fa-trophy',
            action: function () {
              $state.go('app.quests');
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
            name: $scope.string.menu.RECORDS,
            icon: 'fa fa-map',
            action: function () {
              $state.go('app.records');
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