'use strict';

var app = angular.module('pandamoniumApp');

app.factory('QuestionResource', function(BaseResource){

    var endpoint = '/v2/527ec073fbe1d29a00e1ba2b',
            params = {},
            options = {};

    return new BaseResource(endpoint, params, options);

});