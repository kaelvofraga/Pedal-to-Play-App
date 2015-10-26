/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', ['$scope', '$window', 'ImageService', 
                            function ($scope, $window, ImageService) 
    {      
      $scope.supportsSVG = document.implementation.hasFeature(
                            "http://www.w3.org/TR/SVG11/feature#Shape", "1.0");      
                            
      $scope.avatarPieces = null;
      $scope.selectPiece = null;
      $scope.options = null;
      
      var Snap = $window.Snap;
      var drawingArea = Snap('.avatar');
      var svgContent = null;
      var currentOption = 0;
      var avatarBaseGroup = {};    
      
      $scope.onNextOptionClick = function () {
        if (currentOption < $scope.options.length) {
          var value = $scope.options[currentOption].value;
          var element = svgContent.select(value);
          avatarBaseGroup.remove(element);
          ++currentOption;
          avatarBaseGroup.append(svgContent.select(
              $scope.avatarPieces[$scope.selectPiece].options[currentOption].value));
        }
      }
      
      $scope.onPreviousOptionClick = function () {
        
      }
               
      $scope.onPieceClick = function (reference) {
        $scope.selectPiece = reference;
        if (!angular.isUndefined($scope.avatarPieces[reference])) {
          $scope.options = $scope.avatarPieces[reference].options;
        }
      }
      
      $scope.getPath = function (reference) {
        return "img/avatar/icons/" + reference + ".svg";
      }
      
      ImageService.getAvatarPieces().then( function (avatarPieces) {
        var avatarSVG = '';
        var userGender = 'F';
        
        $scope.avatarPieces = avatarPieces;
        $scope.selectPiece = avatarPieces.icons[2].reference;
        $scope.options = avatarPieces[$scope.selectPiece].options;
         
        if (userGender === 'F') {
          avatarSVG = avatarPieces.female;
        } else {
          avatarSVG = avatarPieces.male;
        }            
        
        Snap.load(avatarSVG, function (svg) {
          svgContent = svg;
          avatarBaseGroup = svg.select(avatarPieces.base);
          drawingArea.append(avatarBaseGroup);
          avatarBaseGroup.append(svg.select(avatarPieces.faces.options[currentOption].value));
          avatarBaseGroup.append(svg.select(avatarPieces.shorts.options[currentOption].value));
          avatarBaseGroup.append(svg.select(avatarPieces.jerseys.options[currentOption].value));
          avatarBaseGroup.append(svg.select(avatarPieces.shoes.options[currentOption].value));          
          avatarBaseGroup.append(svg.select(avatarPieces.hairs.options[currentOption].value));
        });  
      });      
    }]);
})();