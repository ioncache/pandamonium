'use strict';

var app = angular.module('pandamoniumApp');

app.factory('BaseResource', function($resource) {

    var defaults = {
        baseURL: 'http://www.mocky.io',
        baseParams: {},
        baseOptions: {},
        endPoint: '/v2/527ec073fbe1d29a00e1ba2b'
    };

    return function(data) {
        var params   = data.params || {},
            options  = data.options || {},
            baseURL  = data.baseURL || defaults.baseURL,
            endpoint = data.endpoint || defaults.endpoint;

        var url = baseURL + '/:id',
            p   = _.extend(params, defaults.baseParams),
            o   = _.extend(options, defaults.baseOptions);

        return $resource(url, p, o);
    };

});