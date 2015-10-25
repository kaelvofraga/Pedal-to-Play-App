/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', ['$scope', '$window', 'ImageService', 
                            function ($scope, $window, ImageService) 
    {      
      $scope.supportsSVG = document.implementation.hasFeature(
                            "http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
      
      ImageService.getAvatarPieces().then( function (avatarPieces) {
        var userGender = 'F';
        var Snap = $window.Snap;
        var drawingArea = Snap('.avatar');
        var avatarSVG = '';

        if (userGender === 'F') {
          avatarSVG = avatarPieces.female;
        } else {
          avatarSVG = avatarPieces.male;
        }            
        
        Snap.load(avatarSVG, function (svg) {
          var baseGroup = svg.select(avatarPieces.base);
          drawingArea.append(baseGroup);
          baseGroup.append(svg.select(avatarPieces.faces.options[0].value));
          baseGroup.append(svg.select(avatarPieces.shorts.options[0].value));
          baseGroup.append(svg.select(avatarPieces.jersey.options[0].value));
          baseGroup.append(svg.select(avatarPieces.gloves.options[0].value));
          baseGroup.append(svg.select(avatarPieces.shoes.options[0].value));          
          baseGroup.append(svg.select(avatarPieces.glasses.options[0].value));
          baseGroup.append(svg.select(avatarPieces.hairs.options[0].value));
          baseGroup.append(svg.select(avatarPieces.helmet.options[0].value));
        });            
      });      
    }]);
})();