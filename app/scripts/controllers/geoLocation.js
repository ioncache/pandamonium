'use strict';

var app = angular.module('pandamoniumApp');

app.controller('GeoLocationCtrl', function ($scope, GeoService, $rootScope) {
    GeoService();
    $scope.$on("locationChanged", function (event, parameters) {
        $rootScope.coords= parameters.coordinates;
    });
})
