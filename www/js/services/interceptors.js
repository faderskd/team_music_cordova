angular.module("teamMusic").
    factory("unauthorizedInterceptor", function ($q, $injector, $rootScope) {
        return {
            responseError: function (response) {
                if ([404, 401].indexOf(response.status) > 0) {
                    var Account = $injector.get("Account");
                    var $state = $injector.get("$state");
                    Account.clearStorage();

                    $state.go('no-logged.login');
                }
                return $q.reject(response);
            }
        }
    })
    .factory("authorizationInterceptor", function ($injector) {
        return {
            'request': function (config) {
                var Account = $injector.get("Account");
                var token = Account.getUser().token;
                config.headers['Authorization'] = token ? ('Token ' + token) : '';
                return config;
            }
        };
    })
