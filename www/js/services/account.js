angular.module("teamMusic")
    .factory("Account", function ($q, $http, localStorageService) {
        var user = {};
        var account = {
            // cookies
            loadUserFromCookie: function () {
                var userData = localStorageService.get('userData');

                if (userData.token && userData.id && userData.username) {
                    user.token = userData.token;
                    user.id = userData.id;
                    user.username = userData.username;

                    return user;
                }
                account.clearStorage();
                return null;
            },
            clearStorage: function () {
                localStorageService.clearAll();
            },

            // authorization
            getUser: function () {
                return user;
            },
            login: function (loginUrl, data) {
                var deffered = $q.defer();

                // clear previous cookies if any exists
                account.clearStorage();

                $http({
                        method: 'POST',
                        url: loginUrl,
                        data: data
                    }
                ).then(function successCallback(response) {
                        // set user
                        user = response.data;

                        // set cookies
                        localStorageService.set('userData', user);

                        deffered.resolve(response);
                    }, function errorsCallback(response) {
                        deffered.reject(response);
                    });
                return deffered.promise;
            },
            isLogged: function () {
                return Object.keys(user).length != 0;
            }
        };
        return account;
    });