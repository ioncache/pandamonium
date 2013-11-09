'use strict';

var app = angular.module('pandamoniumApp');

app.controller('LoginCtrl', function ($cookieStore, $scope, $rootScope, $window, $location, AuthObj) {
    //TODO:  write persistence code here
    $cookieStore.put('oauthcode', $window.location.search);
    $location.path('/')
  
    $scope.loginButtonText = "Login";

    $scope.loginUser = function() {
        if(!AuthObj.getLoginStatus()) {
            AuthObj.login()
        };
        $scope.auth0.show({
            connections: ['twitter', 'facebook', 'google-oauth2' ],
            icon: '//logo-32.png',
            showIcon: true
        });
        $scope.loginButtonText = "LogOut";
    };
  
    $scope.logoutUser = function() {
        if(AuthObj.getLoginStatus()) {
            AuthObj.logout()
        };
        $scope.loginButtonText = "Login";
    };

    $scope.$watch(AuthObj.getLoginStatus, function(newVal, oldVal){
        $scope.loginButtonText = newVal;
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
