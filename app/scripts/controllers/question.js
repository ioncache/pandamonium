'use strict';

var app = angular.module('pandamoniumApp');

app.controller('QuestionCtrl', function ($scope, $rootScope, $resource, $routeParams, BaseModel) {
    $rootScope.controller = 'QuestionCtrl';

    var Question = $resource('/api/v1/question/:id', { id: '@id' });
    $scope.question = Question.get({ id: $routeParams.id });
    console.log($scope.question);
    //var recentQuestionInterval = setInterval( function() {
    //    $scope.questions = Question.query();
    //}, 1000);

});
