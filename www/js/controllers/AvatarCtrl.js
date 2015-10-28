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
      var avatarGender = 'F';      
      var colorPicker = angular.element('.color-picker')
      
      colorPicker.colorpicker({
        customClass: 'colorpicker-2x',
        sliders: {
          saturation: {
            maxLeft: 150,
            maxTop: 150
          },
          hue: {
            maxTop: 150
          }
        },
        template: '<div class="colorpicker dropdown-menu">' +
        '<div class="colorpicker-saturation"><i><b></b></i></div>' +
        '<div class="colorpicker-hue"><i></i></div>' +
        '<div class="colorpicker-color"><div /></div>' +
        '<div class="colorpicker-selectors"></div>' +
        '</div>'
      });
      
      colorPicker.colorpicker().on('changeColor.colorpicker', function (event) {
        that.changeElementColor(event.color.toHex());
      });      
            
      this.changeElementColor = function (colorHex) {
        var elementObjs = null;
        if (elementObjs = avatarBaseGroup.selectAll($scope.avatarImages.head + ',' + 
                                                    $scope.avatarImages.arms + ',' + 
                                                    $scope.avatarImages.legs )) {
          for (var i = 0; i < elementObjs.items.length; i++) {
            var result = elementObjs[i].selectAll('path');
            if (result.items.length > 0) {
              result.attr({ fill: colorHex });
            } else {
              elementObjs[i].attr({fill: colorHex });
            }
          }                 
        }
      }
      
      this.loadSvgAvatarImages = function () {     
        var avatarSvgPath = '';
        if (avatarGender === 'F') {
          avatarSvgPath = $scope.avatarImages.female;
        } else {
          avatarSvgPath = $scope.avatarImages.male;
        }    
        
        Snap.load($scope.avatarImages.bikesFile, function (bikesSVG) {
          Snap.load(avatarSvgPath, function (avatarSVG) {
            svgContent = Snap.fragment(avatarSVG, bikesSVG);
            avatarBaseGroup = svgContent.select(angular.copy($scope.avatarImages.base));
            drawingArea.append(avatarBaseGroup);
            angular.forEach($scope.avatarImages.pieces, function (piece, key) { 
              if ((key === "helmets") || (key === "glasses")){
                drawingArea.append(
                  angular.copy(
                    svgContent.select(piece.options[avatarReferences[piece.id]].value)
                  )
                );
              } else {
                avatarBaseGroup.append(
                  angular.copy(
                    svgContent.select(piece.options[avatarReferences[piece.id]].value)
                  )
                );
              } 
            });
          });  
        }); 
      }
      
      this.initializeReferences = function (avatarPieces) {                
        angular.forEach(avatarPieces, function (value, key) {
          avatarReferences[value.id] = 0;
        });       
      }     
      
      this.addPieceToAvatar = function (before) {
        if (!angular.isUndefined($scope.selectedPiece)) {
          var option = $scope.selectedPiece.options[avatarReferences[$scope.selectedPiece.id]];
          if (!angular.isUndefined(option)) {
            var elementValue = option.value;
            var elementObj = null;
            if (elementValue && (elementObj = svgContent.select(elementValue))) {              
              if (before) {
                before.after(angular.copy(elementObj));
              } else if (($scope.iconActived === "helmets") || 
                         ($scope.iconActived === "glasses")) {
                drawingArea.append(angular.copy(elementObj));
              } else {
                avatarBaseGroup.append(angular.copy(elementObj));
              }
            }
          }            
        }
      }
         
      $scope.pickColor = function () {
        colorPicker.colorpicker('show');
      }          
         
      $scope.changeAvatarGender = function () {
        angular.element('#genderModal').modal('hide');
        avatarGender = avatarGender == 'F' ? 'M' : 'F';
        drawingArea.selectAll('*').remove();
        that.loadSvgAvatarImages();
      }
      
      $scope.onNextOptionClick = function () {
        if (!angular.isUndefined($scope.avatarImages.pieces[$scope.iconActived])) {
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
      }
      
      $scope.onPreviousOptionClick = function () {
        if (!angular.isUndefined($scope.avatarImages.pieces[$scope.iconActived])) {
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
      }
               
      $scope.onPieceClick = function (reference) {
        $scope.iconActived = reference;        
        if (reference === 'genders') {
          angular.element('#genderModal').modal('show');
        } else if (!angular.isUndefined($scope.avatarImages.pieces[reference])) {
          $scope.selectedPiece = $scope.avatarImages.pieces[reference];
        }
      }
      
      $scope.getPath = function (reference) {
        return "img/avatar/icons/" + reference + ".svg";
      }
      
      ImageService.getAvatarImages().then( function (avatarImages) {        
        $scope.avatarImages = avatarImages;
        $scope.iconActived = avatarImages.icons[1].reference
        $scope.selectedPiece = avatarImages.pieces[$scope.iconActived];
        that.initializeReferences(avatarImages.pieces);
        that.loadSvgAvatarImages();        
      });      
    }]);
})();