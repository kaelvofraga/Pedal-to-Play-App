/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', ['$scope', '$window', 'AvatarService', 'ImageService', 
                            function ($scope, $window, AvatarService, ImageService) 
    {            
      var that = this;
      var Snap = $window.Snap;
      var drawingArea = Snap('.avatar');
      var svgContent = null;
      var avatarBaseGroup = {};
      var colorPicker = angular.element('.color-picker')
      
      var avatar = {};
      avatar.pieces = [];
      avatar.gender = '';
      avatar.skinColor = '';
      
      $scope.supportsSVG = true;                            
      $scope.avatarImages = null;
      $scope.selectedPiece = null;
      $scope.iconActived = null;
      
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
                  
      this.initializeAvatar = function (avatarPieces) {      
        var savedAvatar = AvatarService.recoverCustomization();
        if (savedAvatar &&
            angular.isDefined(savedAvatar.gender) &&
            angular.isDefined(savedAvatar.skinColor) &&
            angular.isDefined(savedAvatar.pieces)) 
        {
          angular.copy(savedAvatar, avatar);
          angular.forEach(avatarPieces, function (value, key) {
            avatar.pieces[value.id] = savedAvatar.pieces[value.id] || 0;
          }); 
        } else {
          avatar.gender = $scope.avatarImages.defaultGender;
          avatar.skinColor = $scope.avatarImages.defaultSkinColor;
          angular.forEach(avatarPieces, function (value, key) {
            avatar.pieces[value.id] = 0;
          });          
        }                  
      }  
            
      this.changeElementColor = function (colorHex) {
        var elementObjs = null;
        if (elementObjs = avatarBaseGroup.selectAll($scope.avatarImages.head + ',' + 
                                                    $scope.avatarImages.arms + ',' + 
                                                    $scope.avatarImages.legs )) {
          for (var i = 0; i < elementObjs.items.length; i++) {
            var result = elementObjs.items[i].selectAll('path');
            if (result.items.length > 0) {
              result.attr({ fill: colorHex });
            } else {
              elementObjs.items[i].attr({fill: colorHex });
            }
            avatar.skinColor = colorHex;
          }                 
        }
      }
      
      this.loadSvgAvatarImages = function () {     
        var avatarSvgPath = '';
        if (avatar.gender === 'F') {
          avatarSvgPath = $scope.avatarImages.female;
        } else {
          avatarSvgPath = $scope.avatarImages.male;
        }    
        
        Snap.load($scope.avatarImages.bikesFile, function (bikesSVG) {
          Snap.load(avatarSvgPath, function (avatarSVG) {
            svgContent = Snap.fragment(avatarSVG, bikesSVG);
            avatarBaseGroup = svgContent.select(angular.copy($scope.avatarImages.base));
            if (avatar.skinColor.length > 0) {
              that.changeElementColor(avatar.skinColor);
            }
            drawingArea.append(avatarBaseGroup);
            $scope.supportsSVG = angular.isDefined(angular.element($scope.avatarImages.base));                            
            angular.forEach($scope.avatarImages.pieces, function (piece, key) { 
              if ((key === "helmets") || (key === "glasses")){
                drawingArea.append(
                  angular.copy(
                    svgContent.select(piece.options[avatar.pieces[piece.id]].value)
                  )
                );
              } else {
                avatarBaseGroup.append(
                  angular.copy(
                    svgContent.select(piece.options[avatar.pieces[piece.id]].value)
                  )
                );
              } 
            });
          });  
        }); 
      }   
      
      this.addPieceToAvatar = function (before) {
        if (angular.isDefined($scope.selectedPiece)) {
          var option = $scope.selectedPiece.options[avatar.pieces[$scope.selectedPiece.id]];
          if (angular.isDefined(option)) {
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
        avatar.gender = avatar.gender == 'F' ? 'M' : 'F';
        drawingArea.selectAll('*').remove();
        that.loadSvgAvatarImages();
      }
      
      $scope.onNextOptionClick = function () {
        if (angular.isDefined($scope.avatarImages.pieces[$scope.iconActived])) {
          var element = drawingArea.select($scope.selectedPiece.options[avatar.pieces[$scope.selectedPiece.id]].value);      
          ++(avatar.pieces[$scope.selectedPiece.id]);
          if (avatar.pieces[$scope.selectedPiece.id] >= $scope.selectedPiece.options.length) {
            avatar.pieces[$scope.selectedPiece.id] = 0;
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
        if (angular.isDefined($scope.avatarImages.pieces[$scope.iconActived])) {
          var element = drawingArea.select($scope.selectedPiece.options[avatar.pieces[$scope.selectedPiece.id]].value);
          --(avatar.pieces[$scope.selectedPiece.id]);
          if (avatar.pieces[$scope.selectedPiece.id] < 0) {
            avatar.pieces[$scope.selectedPiece.id] = $scope.selectedPiece.options.length - 1;
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
        } else if (angular.isDefined($scope.avatarImages.pieces[reference])) {
          $scope.selectedPiece = $scope.avatarImages.pieces[reference];
        }
      }
      
      $scope.save = function () {
        AvatarService.saveCustomization(avatar);
      }
      
      $scope.share = function () {
        return true; //TODO implementar compartilhamento
      }
      
      $scope.getPath = function (reference) {
        return "img/avatar/icons/" + reference + ".svg";
      }
      
      ImageService.getAvatarImages().then( function (avatarImages) {        
        $scope.avatarImages = avatarImages;
        $scope.iconActived = avatarImages.icons[1].reference
        $scope.selectedPiece = avatarImages.pieces[$scope.iconActived];
        that.initializeAvatar(avatarImages.pieces);
        that.loadSvgAvatarImages();        
      });      
    }]);
})();