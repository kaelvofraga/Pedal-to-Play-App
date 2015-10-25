/// <reference path="../../libs/typings/angularjs/angular.d.ts"/>

(function () { 
  'use strict';
  
  angular.module('Pedal2Play')
    .controller('AvatarController', ['$scope', '$window', 'ImageService', 
                            function ($scope, $window, ImageService) 
    {  
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
          baseGroup.append(svg.select(avatarPieces.faces.cute));
          baseGroup.append(svg.select(avatarPieces.shorts.professional));
          baseGroup.append(svg.select(avatarPieces.jersey.professional));
          baseGroup.append(svg.select(avatarPieces.gloves.professional));
          baseGroup.append(svg.select(avatarPieces.shoes.professional));
          baseGroup.append(svg.selectAll(avatarPieces.gradients));
          baseGroup.append(svg.select(avatarPieces.glasses));
          baseGroup.append(svg.select(avatarPieces.hairs.curly));
          baseGroup.append(svg.select(avatarPieces.helmet));
        });            
      });      
    }]);
})();