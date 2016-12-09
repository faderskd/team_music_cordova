angular.module("teamMusic")
    .factory('Messages', function () {
        var messages = [];
        return {
            setMessage: function (message) {
                messages.push(message);
            },
            getMessage: function () {
                return messages.shift() || "";
            }
        }
    });