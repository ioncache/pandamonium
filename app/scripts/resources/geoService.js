'use strict';

var app = angular.module('pandamoniumApp');

app.factory('GeoService', ['$q', '$rootScope', function($q, $rootScope) {
  return function() {
    
    $rootScope.changeLocation = function(coords) {
      console.log(coords);
      $rootScope.$broadcast("locationChanged", {
        coordinates: coords
      });
    };
    
    var defer = $q.defer();
    setTimeout(function() {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(

          function(position) {
            $rootScope.$apply(function() {
              var longitude = position.coords.longitude;
              $rootScope.changeLocation(position.coords);
              defer.resolve({
                aField: 'Hello ' + position.coords.longitude + '!'
              });
            });
          }, function(error) {
            defer.reject(error);
          });
        } else {
          defer.reject('location services not allowed');
        }
      } catch (err) {
        defer.reject(err);
      }
    }, 1000);
    return defer.promise;
  };
}]);
