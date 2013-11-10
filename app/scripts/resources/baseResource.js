'use strict';

var app = angular.module('pandamoniumApp');

app.factory('BaseResource', function($resource) {

    var defaults = {
        baseURL: 'http://www.mocky.io',
        baseParams: {
            callback: 'JSON_CALLBACK'
        },
        baseOptions: {
            query: {
                method: 'JSONP'
            }
        },
        endPoint: '/v2/527ec073fbe1d29a00e1ba2b'
    };

    return function(data) {
        var params = data.params || {};
        var options = data.options || {};
        var baseURL = data.baseURL || defaults.baseURL;
        var endpoint = data.endpoint || defaults.endpoint;

        var url = baseURL + endpoint,
            p = _.extend(params, defaults.baseParams),
            o = _.extend(options, defaults.baseOptions);

        return $resource(url, p, o);
    };

});