'use strict';

var panda = angular.module('pandamoniumApp');

panda.controller('MainCtrl', function ($scope, $resource, $rootScope, $location) {
    $rootScope.controller = 'MainCtrl';
    
    var Question = $resource('/api/v1/question/:id', { id: '@id' });
    var recentQuestionInterval = setInterval( function() {
        $scope.questions = Question.query();
    }, 1000);


    $scope.viewQuestion = function(id) {
        $location.path('/question/' + id);
    }

});
