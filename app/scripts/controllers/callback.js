'use strict';

angular.module('pandamoniumApp')
  .controller('CallbackCtrl', function ($cookieStore, $rootScope, $window, $location) {
    //TODO:  write persistence code here
    $cookieStore.put('oauthcode', $window.location.search);
    $location.path('/')
  });