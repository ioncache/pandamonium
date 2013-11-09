'use strict';

var app = angular.module('pandamoniumApp');

app.controller('RecentQuestionsCtrl', function ($scope, QuestionResource, BaseModel) {
    $scope.questions = [];
    $scope.questions.push(new BaseModel({ id: 1 }, QuestionResource) );
    $scope.questions.push(new BaseModel({ id: 2 }, QuestionResource) );

    _.each($scope.questions, function(e, i) {
        e.fetch();
    });
});
