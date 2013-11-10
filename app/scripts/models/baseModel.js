'use strict';

var app = angular.module('pandamoniumApp');

app.factory('BaseModel', function (BaseResource) {
    var Model = function(data) {
        this.data = data.model;
        if (data.hasOwnProperty('resource')) {
            this.resource = new BaseResource(data.resource);
        }
    }

    Model.prototype.fetch = function() {
        var self = this;

        if (this.hasOwnProperty('resource')) {
            this.resource.query( function(result) {
                self.data = result.data;
            });
        }
    };

    return Model;
});
