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
      var avatarReferences = {};
      var avatarBaseGroup = {};    
      
      $scope.onNextOptionClick = function () {
        if (currentOption < $scope.options.length - 1) {	  
		  var element = avatarBaseGroup.select($scope.options[currentOption].value);
		  element.remove();
          ++currentOption;
          avatarBaseGroup.append(
			angular.copy(
				svgContent.select(
					$scope.avatarPieces[$scope.selectPiece].options[currentOption].value
				)
			)
		  );
        }
      }
      
      $scope.onPreviousOptionClick = function () {
        if (currentOption > 0) {
          var element = avatarBaseGroup.select($scope.options[currentOption].value);
		  element.remove();
          --currentOption;
          avatarBaseGroup.append(
			angular.copy(
				svgContent.select(
					$scope.avatarPieces[$scope.selectPiece].options[currentOption].value
				)
			)
		  );
        }        
      }
               
      $scope.onPieceClick = function (reference) {
        $scope.selectPiece = reference;
		currentOption = 0;
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
		
		//TODO implements avatarReferences
		
        Snap.load(avatarSVG, function (svg) {
          svgContent = svg;
          avatarBaseGroup = svg.select(avatarPieces.base);
          drawingArea.append(avatarBaseGroup);
          avatarBaseGroup.append(
			angular.copy(
				svg.select(avatarPieces.faces.options[0].value)
			)
		  );
          avatarBaseGroup.append(
			angular.copy(
				svg.select(avatarPieces.shorts.options[0].value)
			)
		  );
          avatarBaseGroup.append(
			angular.copy(
				svg.select(avatarPieces.jerseys.options[0].value)
			)
		  );
          avatarBaseGroup.append(
			angular.copy(
				svg.select(avatarPieces.shoes.options[0].value)
			)
		  );          
          avatarBaseGroup.append(
			angular.copy(
				svg.select(avatarPieces.hairs.options[0].value)
			)
		  );
        });  
      });      
    }]);
})();