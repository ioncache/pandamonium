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
    .when('/addQuestion', {
        templateUrl: 'views/addQuestion.html',
        controller: 'AddQuestionCtrl'
    })
    .when('/callback', {
        templateUrl: 'views/callback.html',
        controller: 'CallbackCtrl'
    })
    .when('/question/:id', {
        templateUrl: 'views/question.html',
        controller: 'QuestionCtrl'
    })
    .when('/question/:id/reply', {
        templateUrl: 'views/replyQuestion.html',
        controller: 'ReplyQuestionCtrl'
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
