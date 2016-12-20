angular.module('teamMusic')
    .controller('registerFormController', function ($scope, $http, $state, $ionicPopup, ApiUrls) {

        $scope.saveRegisterForm = function (newUser) {
            if ($scope.registerForm.$valid) {
                $http({
                    method: 'POST',
                    url: ApiUrls.registerUrl,
                    data: newUser
                }).then(function successCallback(response) {
                        var message = "Well done! You have successfully registered in TeamMusic. Now you can login";
                        $ionicPopup.alert({
                            title: message,
                            template: ''
                        }).then(function (res) {
                            $state.go('no-logged.login');
                        });
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
