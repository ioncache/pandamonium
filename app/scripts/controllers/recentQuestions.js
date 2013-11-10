'use strict';

var app = angular.module('pandamoniumApp');

app.controller('RecentQuestionsCtrl', function ($scope, $http, QuestionResource, BaseModel) {
    $scope.questions = [];

    var recentQuestions = $http({
        method: 'GET',
        url: 'http://localhost:8000/api/v2/questions'
    })
    .success(function(data, status, headers, config) {
        console.log(data);
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });

    $scope.questions.push(new BaseModel({
        resource: {
            baseURL: 'http://localhost:8000/api/v1/questions',
            endpoint: '12345'
        }
    }));

    _.each($scope.questions, function(e, i) {
        e.fetch();
    });
});
