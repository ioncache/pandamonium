'use strict';

var app = angular.module('pandamoniumApp');

app.controller('MainCtrl', function ($scope, $sanitize, $resource, $rootScope, $location) {
    $rootScope.controller = 'MainCtrl';

    var Question = $resource('/api/v1/question/:id', { id: '@id' });
    $scope.questions = Question.query();

    var recentQuestionInterval = setInterval( function() {
        var newQuestions = Question.query();
        var currentIds = _.pluck($scope.questions, 'id');

        var differentQuestions = _.filter(newQuestions, function(item) {
            return !_.contains(currentIds, item.id);
        });

        if ( differentQuestions.length > 0 ) {
            var numToRemove = differentQuestions.length + $scope.questions.length - 20;

            if ( numToRemove <= 0 ) {
                for ( var i = 0 ; i < differentQuestions.length ; i++ ) {
                    $scope.questions.push(differentQuestions.shift());
                }
            }
            else {
                for ( var i = 0 ; i < numToRemove ; i++ ) {
                    $scope.questions.shift();
                    $scope.questions.push(differentQuestions.shift());
                }
            }
        }

    }, 1000);

    $scope.locationSelect = {
        minimumInputLength: 1,
        ajax: {
            quietMillis: 50,
            url: function(data){
                if($rootScope.coords){
                  return "/api/v1/venues/explore/"+$rootScope.coords.latitude+"/"+$rootScope.coords.longitude+"/" + $sanitize(data);
                }
            },
            data: function (term, page) {
            },
            results: function (data, page) {
                return {"results": JSON.parse(data).response.groups[0].items};
            }
        },
        formatResult: locationFormatResult,
        formatSelection: locationFormatSelection
    }

    $scope.viewQuestion = function(id) {
        $location.path('/question/' + id);
    }
});

function locationFormatResult(location) {
    return "<li class='venue-info'>" + location.venue.name + "</li>";;
}

function locationHash(location) {
    var hashed = { 
      "name": location.venue.name,
      "lat": location.venue.location ? location.venue.location.lat : '',
      "lng": location.venue.location ? location.venue.location.lng : ''
    }
    return JSON.stringify(hashed);
}

function locationFormatSelection(location) {
  return location.venue.name;
}
