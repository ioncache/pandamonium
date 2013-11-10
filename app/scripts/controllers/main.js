'use strict';

var app = angular.module('pandamoniumApp');

app.controller('MainCtrl', function ($scope, $sanitize, $resource, $rootScope, $location) {
    $rootScope.controller = 'MainCtrl';

    var Question = $resource('/api/v1/question/:id', { id: '@id' });
    var recentQuestionInterval = setInterval( function() {
        $scope.questions = Question.query();
    }, 1000);
    
    $scope.locationSelect = {

        minimumInputLength: 1,
        ajax: {
            quietMillis: 50,
            url: function(data){
                if($rootScope.coords){
                  
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
