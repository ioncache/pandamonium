'use strict';

var panda = angular.module('pandamoniumApp')
  .controller('MainCtrl', function ($scope) {

  }).run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {
      $rootScope.auth0 = new Auth0Widget({
          domain:       	'pandamonium.auth0.com',
        	clientID:     	'fWAN4aT5cD8jLE9vWaIRqN9mMJSPZIGI',
        	callbackURL:  	'http://' + window.location.host + '/#/callback',
        	callbackOnLocationHash: false
        });


  }]);

panda.service('AuthObj', function($rootScope) {
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

panda.controller('MainCtrl', function($scope, AuthObj) {
  $scope.loginButtonText = "Login";
  $scope.loginUser = function() {
    if(!AuthObj.getLoginStatus()){
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
    if(AuthObj.getLoginStatus()){
      AuthObj.logout()
    };
    $scope.loginButtonText = "Login";
  };
  $scope.$watch(AuthObj.getLoginStatus, function(newVal, oldVal){
      $scope.loginButtonText = newVal;
  });
});


