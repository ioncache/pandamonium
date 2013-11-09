'use strict';

var app = angular.module('pandamoniumApp');

app.factory('BaseResource', function($resource){

    var baseURL = 'http://www.mocky.io',
        baseParams = {
            callback: 'JSON_CALLBACK'
        },
        baseOptions = {
            query: {
                method: 'JSONP'
            }
        };

    return function(endpoint, params, options){
        var url = baseURL + endpoint,
            p = _.extend(params, baseParams),
            o = _.extend(options, baseOptions);

        return $resource(url, p, o);
    };

});