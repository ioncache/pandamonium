'use strict';

var app = angular.module('pandamoniumApp');

app.controller('NavBarCtrl', function ($scope, $rootScope, $resource, $location, $routeParams) {

    $scope.addQuestion = function(data) {
        $location.path('addQuestion');
    }

    $scope.saveQuestion = function(data) {
        var r = $resource('/api/v1/question/');

        var Question = {};

        Question.q = $('#newQuestion').val();
        Question.qlat = 74;
        Question.qlong = -125;
        Question.alat = 75;
        Question.along = -122;
        Question.dist = 50;

        r.save(Question);

        $location.path('main');
    }

    $scope.replyQuestion = function() {
        $location.path('/question/' + $routeParams['id'] + '/reply');
    };

    $scope.replyToQuestion = function(id) {
        var r = $resource('/api/v1/question/' + $routeParams['id'] + '/answer');

        var Reply = {};

        Reply.answer = $('#replyToQuestionInput').val();
        Reply.alat = 75;
        Reply.along = -122;

        r.save(Reply);

        $location.path('/question/' + $routeParams['id']);  
    };
});
