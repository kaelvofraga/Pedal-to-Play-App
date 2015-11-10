(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', [
        '$scope'
      , '$window'
      , '$state'
      , '$timeout'
      , 'AvatarService'
      , 'ImageService'
      , 'ProfileService'
      , 'ErrorMessageService'
      ,function ( $scope
                , $window
                , $state
                , $timeout
                , AvatarService
                , ImageService
                , ProfileService
                , ErrorMessageService) {
                              
      var that = this;
      var Snap = $window.Snap;
      var drawingArea = Snap('.avatar');
      var svgContent = null;
      var avatarBaseGroup = {};
      var colorPicker = angular.element('.color-picker');
      var unsavedChanges = false; 
      var avatar = {
          pieces: []
        , gender: ''
        , skinColor: ''
      };
      
      $scope.userLevel = 0;
      $scope.maxLevel = 0;
      $scope.supportsSVG = true;                            
      $scope.avatarImages = {};
      $scope.selectedPiece = null;
      $scope.iconActived = null;
      $scope.nextStateName = null;
      $scope.currentScore = 0;
      
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
            var result = elementObjs.items[i].selectAll('path');
            if (result.items.length > 0) {
              result.attr({ fill: colorHex });
            } else {
              elementObjs.items[i].attr({fill: colorHex });
            }
            avatar.skinColor = colorHex;
            unsavedChanges = true;
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
              avatarBaseGroup.selectAll('path').attr({fill: avatar.skinColor}); 
            }
            drawingArea.append(avatarBaseGroup);
            $scope.supportsSVG = angular.isDefined(angular.element($scope.avatarImages.base));                            
            angular.forEach($scope.avatarImages.pieces, function (piece, key) { 
              if ((key === "helmets") || (key === "glasses")) {
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
            $scope.$apply();
          });  
        }); 
      }   
      
      this.initializeAvatar = function (avatarPieces) {      
        AvatarService.recoverCustomization().then( function (response) {
          var savedAvatar = response;
          if (savedAvatar &&
              angular.isDefined(savedAvatar.gender) &&
              angular.isDefined(savedAvatar.skinColor) &&
              angular.isDefined(savedAvatar.pieces)
          ){
              angular.copy(savedAvatar, avatar);
              angular.forEach(avatarPieces, function (piece, key) {
                var savedOptionIndex = savedAvatar.pieces[piece.id];
                if (savedOptionIndex && (savedOptionIndex > 0) && 
                    (savedOptionIndex < piece.options.length)
                ){
                  avatar.pieces[piece.id] = savedOptionIndex;
                } else {
                  avatar.pieces[piece.id] = 0;
                }
              });
          } else {
            ErrorMessageService.show($scope.string.avatar.SERVER_CONNECT_TO_GET_FAIL);
            avatar.gender = $scope.avatarImages.defaultGender;
            avatar.skinColor = $scope.avatarImages.defaultSkinColor;
            angular.forEach(avatarPieces, function (piece, key) {
              avatar.pieces[piece.id] = 0;
            });
          }
          that.loadSvgAvatarImages();       
        });              
      }  
      
      this.addPieceToAvatar = function (before) {
        if (angular.isDefined($scope.selectedPiece)) {
          var option = $scope.selectedPiece.options[avatar.pieces[$scope.selectedPiece.id]];
          if (angular.isDefined(option)) {
            var elementValue = option.value;
            var elementObj = null;
            unsavedChanges = true;
            if (elementValue && (elementObj = svgContent.select(elementValue))) {
              if (before) {
                before.after(angular.copy(elementObj));
                before.remove();
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
      
      this.checkRequiredLevel = function (option) {        
        return angular.isUndefined(option.requiredLevel) || ($scope.userLevel >= option.requiredLevel);
      }
      
      this.removeUnavailableOptions = function (avatarPieces) {
        angular.forEach(avatarPieces, function (piece, key) {
          var i = 0;
          while (angular.isDefined(piece.options[i])) {
            if (!(that.checkRequiredLevel(piece.options[i]))) {
              piece.options.splice(i, 1);
            } else {
              ++i;
            }
          }
        });
      }
      
      $scope.isAvatarLoading = function () {
        return svgContent === null;
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
        if (($scope.isAvatarLoading() === false) &&
            angular.isDefined($scope.avatarImages.pieces[$scope.iconActived])
        ) {
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
        if (($scope.isAvatarLoading() === false) &&
            angular.isDefined($scope.avatarImages.pieces[$scope.iconActived])
        ) {
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
      
      $scope.dontSave = function () {
        $scope.hideModal('#unsaveModal');          
        unsavedChanges = false;
        $state.go($scope.nextStateName);
      }
      
      $scope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          if ((toState.name !== fromState.name) && (toState.name !== "auth")) {
            $scope.hideModal('#genderModal');
            if (unsavedChanges) {
              angular.element('#unsaveModal').modal('show');
              $scope.nextStateName = toState.name;
              event.preventDefault();
            }
          }
      });
            
      $scope.save = function () {
        AvatarService.saveCustomization(avatar)
          .then( function (response) { 
            unsavedChanges = !response; 
            if (response === false) 
            {                         
              ErrorMessageService.show($scope.string.avatar.SERVER_SAVE_FAIL);
            }
          });       
      }
      
      $scope.share = function () {
        return true; //TODO develop "sharing" routine
      }
      
      $scope.getPath = function (reference) {
        return "img/avatar/icons/" + reference + ".svg";
      }
      
      $scope.getUserEmail = function () {
        return ProfileService.getUserEmail();
      }
      
      $scope.getLevelPercentage = function () {
        if (angular.isNumber($scope.userLevel) && 
            angular.isNumber($scope.maxLevel))
        {
          return ($scope.userLevel / $scope.maxLevel) * 100;
        }
        return 0;
      }
      
      $scope.editAvatar = function () {
        $state.go('app.avatar');
      }
            
      $scope.$on('$viewContentLoaded', function() {
        ProfileService.getUserLevel().then(function (level) {
          ImageService.getAvatarImages().then(function (avatarImages) {
            $scope.userLevel = level;
            $scope.avatarImages = avatarImages;
            if (avatarImages !== null) {
              $scope.iconActived = avatarImages.icons[1].reference;
              that.removeUnavailableOptions(avatarImages.pieces);                        
              $scope.selectedPiece = avatarImages.pieces[$scope.iconActived];            
              that.initializeAvatar(avatarImages.pieces);
            }
          });
        });
        
        ProfileService.getTotalScore().then(
          function (score) {
            if (score) {
              $scope.currentScore = (score / 1000).toFixed(2);
            } else {
              $scope.currentScore = $scope.string.ERROR_DATA_NOT_FOUND;
            }            
          },
          function (error) {
            $scope.currentScore = $scope.string.ERROR_DATA_NOT_FOUND;
          }
        );
        
        ProfileService.getMaxLevel().then(
          function (maxLevel) {
            $scope.maxLevel = maxLevel;
          },
          function (error) {
            $scope.maxLevel = error;
          }
        );        
      });
      
      $scope.$on('$destroy', function () {
        ErrorMessageService.stopShowing()
      }); 
            
    }]);
    
})();