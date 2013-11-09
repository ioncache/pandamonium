'use strict';

var app = angular.module('pandamoniumApp');

app.factory('QuestionModel', function(BaseModel, QuestionResource, $rootScope){

    var defaults = {
        token: $rootScope.token
    }

    return new BaseModel(defaults, QuestionResource);
});
