angular.module('teamMusic')
    .controller('settingsFormController', function ($scope, $http, $state, ApiUrls, Account) {
        var currentUser = Account.getUser();
        $scope.user = {
            username: currentUser.username,
            email: currentUser.email
        };

        $scope.saveSettingsForm = function (user) {
            if ($scope.settingsForm.$valid) {
                $http({
                    method: 'PUT',
                    url: ApiUrls.usersUrl + Account.getUser().id + '/',
                    data: user
                }).then(
                    function successCallback(response) {
                        var currentUser = Account.get
                        $state.go('logged.settings', {}, {reload: true});
                    },
                    function errorCallback(response) {
                        if (response.status == 400) {
                            $scope.errors = response.data;
                        }
                    }
                );
            }
            $scope.settingsForm.submitted = true;
        }
    })
    .directive('checkAllPasswordsFilled', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                password1: '=password1',
                password2: '=password2'
            },
            link: function link(scope, element, attrs, ngModel) {

                ngModel.$validators.required = function (modelValue, viewValue) {
                    return !((scope.password1 || scope.password2) && !modelValue);
                };

                scope.$watch('password1', function () {
                    ngModel.$validate();
                });
                scope.$watch('password2', function () {
                    ngModel.$validate();
                });
            }
        }

    });