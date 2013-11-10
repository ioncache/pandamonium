'use strict';

angular.module('pandamoniumApp').factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        callback.apply(socket, arguments);
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        if (callback) {
          callback.apply(socket, arguments);
        }
      });
    }
  };
});
