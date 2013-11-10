'use strict';

var app = angular.module('pandamoniumApp');

app.controller('MainCtrl', function ($scope,$sanitize,$rootScope) {
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
