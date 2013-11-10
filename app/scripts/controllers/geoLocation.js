'use strict';

var app = angular.module('pandamoniumApp');
var json, item, location, place;
var places = [];
app.controller('GeoLocationCtrl', function ($scope, GeoService, $rootScope, $sanitize, $http) {
    GeoService();
    
    $scope.$on("locationChanged", function (event, parameters) {
        $rootScope.coords= parameters.coordinates;
    });
    
   var select2;
   select2 = $("#newLocation").select2({
      id: function(obj) {
           return Date.now(); // use slug field for id
      },     
      ajax: {
          quietMillis: 50,
          url: function(queryString){
              if($rootScope.coords){
                return "/api/v1/venues/explore/"+$rootScope.coords.latitude+"/"+$rootScope.coords.longitude+"/" + $sanitize(queryString)
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
    });
    
  
    $scope.change = function(){
      var queryString = $scope.GeoService;
      
     
            
      if($rootScope.coords){
        $.ajax({
          url: "/api/v1/venues/explore/"+$rootScope.coords.latitude+"/"+$rootScope.coords.longitude+"/" + urlencode(queryString),
          success: function(data){
            json = JSON.parse(data)
            
            if(json.response && json.response.groups){
              for(item in json.response.groups[0].items){
                var location = json.response.groups[0].items[item]
                places.push({
                  "name": location.venue.name,
                  "lat": location.venue.location ? location.venue.location.lat : '',
                  "lng": location.venue.location ? location.venue.location.lng : ''  
                });
              }
              
            }
          }
        })
      }
    }
})

function locationFormatResult(location) {
    var markup = "<table class='location-result'><tr>";
    markup += "<td class='location-info'><div class='location-title'>" + location.venue.name + "</div>";
    markup += "</td></tr></table>"
    return markup;
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
