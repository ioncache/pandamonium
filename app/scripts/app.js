'use strict';

var app = angular.module('pandamoniumApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/callback', {
        templateUrl: 'views/callback.html',
        controller: 'CallbackCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

