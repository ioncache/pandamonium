'use strict';

var app = angular.module('pandamoniumApp');

app.controller('GeoLocationCtrl', function ($scope, GeoService) {
  GeoService();
  $scope.$on("locationChanged", function (event, parameters) {
    $scope.coords= parameters.coordinates;
  });
})
