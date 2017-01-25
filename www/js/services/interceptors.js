angular.module("teamMusic").
    factory("unauthorizedInterceptor", function ($q, $injector) {
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
    .factory("httpMiscInterceptor", function ($rootScope, $q) {
        return {
            'request': function (config) {
                $rootScope.show();
                return config;
            },
            'response': function (response) {
                $rootScope.hide();
                return response;
            },
            'requestError': function (rejection) {
                $rootScope.hide();
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                $rootScope.hide();
                return $q.reject(rejection);
            }
        }
    });
