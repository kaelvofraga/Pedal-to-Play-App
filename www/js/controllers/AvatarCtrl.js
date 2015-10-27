/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', ['$scope', '$window', 'ImageService', 
                            function ($scope, $window, ImageService) 
    {      
      $scope.supportsSVG = document.implementation.hasFeature(
                            "http://www.w3.org/TR/SVG11/feature#Shape", "1.0");      
                            
      $scope.avatarImages = null;
      $scope.selectedPiece = null;
      $scope.iconActived = null;
      
      var that = this;
      var Snap = $window.Snap;
      var drawingArea = Snap('.avatar');
      var svgContent = null;
      var avatarReferences = [];
      var avatarBaseGroup = {};    
      
      this.initializeReferences = function (avatarPieces) {                
        angular.forEach(avatarPieces, function (value, key) {
          avatarReferences[value.id] = 0;
        });       
      }     
      
      this.addPieceToAvatar = function (before) {
        var elementValue = null;
        var elementObj = null;
        var option = null;
        var piece = $scope.selectedPiece;
        if (!angular.isUndefined(piece)) {
          option = piece.options[avatarReferences[piece.id]];
          if (!angular.isUndefined(option)) {
            elementValue = option.value;
            if (elementValue && (elementObj = svgContent.select(elementValue))) {              
              if (before) {
                before.after(angular.copy(elementObj));
              } else if ((elementValue === "#helmet") || (elementValue === "#glasses")){
                drawingArea.append(angular.copy(elementObj));
              } else {
                avatarBaseGroup.append(angular.copy(elementObj));
              }
            }
          }            
        }
      }
      
      $scope.onNextOptionClick = function () {
        var element = drawingArea.select($scope.selectedPiece.options[avatarReferences[$scope.selectedPiece.id]].value);      
        ++(avatarReferences[$scope.selectedPiece.id]);
        if (avatarReferences[$scope.selectedPiece.id] >= $scope.selectedPiece.options.length) {
          avatarReferences[$scope.selectedPiece.id] = 0;
        } 
        if (element) {
          that.addPieceToAvatar(element);
          element.remove();
        } else {
          that.addPieceToAvatar();
        }               
      }
      
      $scope.onPreviousOptionClick = function () {
        var element = drawingArea.select($scope.selectedPiece.options[avatarReferences[$scope.selectedPiece.id]].value);
        --(avatarReferences[$scope.selectedPiece.id]);
        if (avatarReferences[$scope.selectedPiece.id] < 0) {
          avatarReferences[$scope.selectedPiece.id] = $scope.selectedPiece.options.length - 1;
        }
        if (element) {
          that.addPieceToAvatar(element);
          element.remove();
        } else {
          that.addPieceToAvatar();
        }        
      }
               
      $scope.onPieceClick = function (reference) {
        $scope.iconActived = reference;
        if (!angular.isUndefined($scope.avatarImages.pieces[reference])) {
          $scope.selectedPiece = $scope.avatarImages.pieces[reference];
        }
      }
      
      $scope.getPath = function (reference) {
        return "img/avatar/icons/" + reference + ".svg";
      }
      
      ImageService.getAvatarImages().then( function (avatarImages) {
        var avatarSVG = '';
        var userGender = 'F';
        
        $scope.avatarImages = avatarImages;
        $scope.iconActived = avatarImages.icons[2 /*TODO trocar para 0*/].reference
        $scope.selectedPiece = avatarImages.pieces[$scope.iconActived];
        that.initializeReferences(avatarImages.pieces);
         
        if (userGender === 'F') {
          avatarSVG = avatarImages.female;
        } else {
          avatarSVG = avatarImages.male;
        }            
				
        Snap.load(avatarSVG, function (svg) {
          svgContent = svg;
          avatarBaseGroup = svg.select(angular.copy(avatarImages.base));
          drawingArea.append(avatarBaseGroup);          
          angular.forEach(avatarImages.pieces, function (piece, key) {            
            avatarBaseGroup.append(
              angular.copy(
                svg.select(piece.options[avatarReferences[piece.id]].value)
              )
            );            
          });
        });  
      });      
    }]);
})();