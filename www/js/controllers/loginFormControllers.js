angular.module('teamMusic')
    .controller('loginFormController', function ($scope, $location, localStorageService, Account, ApiUrls) {

        $scope.saveLoginForm = function (user) {
            if ($scope.loginForm.$valid) {
                Account.login(ApiUrls.loginUrl, user)
                    .then(function successCallback(response) {
                        $location.path('/tracks');
                    }, function errorsCallback(response) {
                        $scope.errors = response.data;
                    });
            }
            $scope.loginForm.submitted = true;
        };
    });