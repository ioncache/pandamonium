'use strict';

var app = angular.module('pandamoniumApp');

app.controller('RecentQuestionsCtrl', function ($scope, $http, $resource, BaseModel) {
    $scope.questions = [];

    var Question = $resource('/api/v1/question/:id', { id: '@id' });
    var recentQuestionInterval = setInterval( function() {
        $scope.questions = Question.query();
    }, 1000);

});
