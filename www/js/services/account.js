angular.module("teamMusic")
    .factory("Account", function ($q, $http, localStorageService) {
        var user = {};
        var account = {
            // cookies
            loadUserFromCookie: function () {
                var userData = localStorageService.get('userData');

                if (userData && userData.token && userData.id && userData.username && userData.email) {
                    user = userData;
                    return userData;
                }
                account.clearStorage();
                return null;
            },
            clearStorage: function () {
                user = {};
                localStorageService.clearAll();
            },

            // authorization
            getUser: function () {
                return user;
            },
            setUser: function (newUser) {
                user.email = newUser.email;
                localStorageService.set('userData', user);
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