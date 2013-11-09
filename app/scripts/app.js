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

app.service('AuthObj', function($rootScope) {
  var loggedIn = "Login";
  return {
    login: function(auth0){
      loggedIn="Logout"
    },
    logout: function(){
      $window.location.href = 'https://pandamonium.auth0.com/logout?returnTo=' + window.location.href
      loggedIn="Login";
    },
    getLoginStatus: function(){
      return loggedIn;
    }
  }
});

app.run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {
    $rootScope.auth0 = new Auth0Widget({
        domain:       	'pandamonium.auth0.com',
        clientID:     	'fWAN4aT5cD8jLE9vWaIRqN9mMJSPZIGI',
        callbackURL:  	'http://' + window.location.host + '/#/callback',
        callbackOnLocationHash: false
    });
}]);
