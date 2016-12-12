angular.module('teamMusic')
    .controller('registerFormController', function ($scope, $rootScope, $location, $http, $state, Messages, ApiUrls) {

        $scope.errors = {};
        $scope.newUser = {};

        $scope.saveRegisterForm = function (newUser) {
            if ($scope.registerForm.$valid) {
                $http({
                    method: 'POST',
                    url: ApiUrls.registerUrl,
                    data: newUser
                }).then(function successCallback(response) {
                        var message = "Well done! You have successfully registered in TeamMusic. Now you can login";

                        Messages.setMessage(message);
                        $scope.resetForm();
                        $state.go('no-logged.login');


                    }, function errorCallback(response) {
                        $scope.errors = response.data;
                    }
                )

            }
            $scope.registerForm.submitted = true;
        };

    }).directive('passwordCheck', function () {
        return {
            require: "ngModel",
            scope: {
                password2: "=passwordCheck"
            },
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.pwmatch = function (modelValue, viewValue) {
                    return modelValue == scope.password2;
                };

                scope.$watch("password2", function () {
                    ngModel.$validate();
                });
            }
        };
    });
