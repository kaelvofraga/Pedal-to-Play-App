/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AuthController', ['AuthService', '$scope', 'md5', function (AuthService, $scope, md5) {
      
      $scope.isRegistering = false;
      $scope.user = {};
      $scope.confirmPassword;
      $scope.temporaryPassword;
      $scope.errorMessage = '';

      this.clearFields = function () {
        $scope.authForm.$setPristine();
        $scope.authForm.$setUntouched();
        $scope.confirmPassword = "";
        $scope.temporaryPassword = "";
        $scope.errorMessage = "";
      }

      this.changeOperation = function () {
        $scope.user.email = "";
        this.clearFields();
        $scope.isRegistering = !$scope.isRegistering;
      }

      this.signUser = function () {
        $scope.user.password = md5.createHash($scope.temporaryPassword);
        this.clearFields();
        if ($scope.isRegistering) {
          AuthService.signUp($scope); //call register service
        } else {
          AuthService.signIn($scope); //call login service
        }
      }
    }])

    .directive('passwordValidator', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$validators.comparePasswords = function (modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              // consider empty models to be valid
              return true;
            }
            if (scope.temporaryPassword === modelValue) {
              return true;
            }
            return false;
          };
        }
      };
    })

    .directive('emailValidator', ['AuthService', '$q', function (AuthService, $q) {
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$asyncValidators.isValidEmail = function (modelValue, viewValue) {
                       
            if (scope.isRegistering === false) {
              // just validate in registering
              return $q.when();
            }

            if (ctrl.$isEmpty(modelValue)) {
              // consider empty models to be valid
              return $q.when();
            }
            
            return AuthService.isValidEmail(modelValue);       
          }
        }
      };
    }]);
})();