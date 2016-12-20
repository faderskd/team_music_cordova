angular.module('teamMusic')
    .controller('loginFormController', function ($scope, $state, Account, ApiUrls) {

        $scope.saveLoginForm = function (user) {
            if ($scope.loginForm.$valid) {
                Account.login(ApiUrls.loginUrl, user)
                    .then(function successCallback(response) {
                        $state.go('logged.track-list');
                    }, function errorsCallback(response) {
                        $scope.errors = response.data;
                    });
            }
            $scope.loginForm.submitted = true;
        };
    });