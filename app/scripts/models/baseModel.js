'use strict';

var app = angular.module('pandamoniumApp');

app.factory('BaseModel', function () {
    var Model = function(data, resource) {
        this.data = data;
        this.resource = resource;
    }

    Model.prototype.fetch = function() {
        var self = this;

        this.resource.query( function(result) {
            self.data = result.data;
        });
    };

    return Model;
});
