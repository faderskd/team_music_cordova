angular.module('teamMusic')
    .controller('loginFormController', function ($scope, $location, localStorageService, $window, $state, Account, ApiUrls) {

        $scope.user = {};
        $scope.saveLoginForm = function (user) {
            if ($scope.loginForm.$valid) {
                Account.login(ApiUrls.loginUrl, user)
                    .then(function successCallback(response) {
                        $scope.resetForm();
                        $state.go('logged.settings');
                    }, function errorsCallback(response) {
                        $scope.errors = response.data;
                    });
            }
            $scope.loginForm.submitted = true;
        };

        $scope.resetForm = function() {
            $scope.loginForm.submitted = false;
            $scope.user = {};
            $scope.errors = {};
        }
    });