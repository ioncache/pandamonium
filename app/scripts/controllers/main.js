'use strict';

var app = angular.module('pandamoniumApp');

app.controller('MainCtrl', function ($scope) {
  // Built-in support for ajax
   $scope.locationSelect = {
     minimumInputLength: 1,
     ajax: {
       url: "/api/v1/venues/explore/43.6460675/-79.39230429999999",
       data: function (term, page) {
         return {};
       },
       results: function (data, page) {
         console.log(JSON.parse(data).response.groups[0].items)
         return {"results": JSON.parse(data).response.groups[0].items};
       }
     },
     formatResult: locationFormatResult,
     formatSelection: locationFormatSelection
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