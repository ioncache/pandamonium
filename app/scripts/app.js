'use strict';

var app = angular.module('pandamoniumApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io'
]);

app.config(function ($routeProvider) {
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

app.run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {
    $rootScope.auth0 = new Auth0Widget({
        domain:       	'pandamonium.auth0.com',
        clientID:     	'fWAN4aT5cD8jLE9vWaIRqN9mMJSPZIGI',
        callbackURL:  	'http://' + window.location.host + '/#/callback',
        callbackOnLocationHash: false
    });
}]);
