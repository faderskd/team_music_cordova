angular.module('teamMusic')
    .controller('settingsFormController', function ($scope, Account) {
        var currentUser = Account.getUser();
        $scope.user = {
            username: currentUser.username,
            email: currentUser.email
        };

        $scope.saveSettingsForm = function (user) {
            if ($scope.settingsForm.$valid) {

            }
            $scope.settingsForm.submitted = true;
        }
    })
    .directive('checkAllPasswordsFilled', function ($parse) {
        return {
            require: 'ngModel',
            link: function link(scope, element, attrs, ngModel) {
                var password1Expression = attrs.password1;
                var password2Expression = attrs.password2;

                var password1 = $parse(password1Expression);
                var password2 = $parse(password2Expression);
                password1.assign(scope);
                password2.assign(scope);
                ngModel.$validators.$required = function (modelValue, viewValue) {
                    console.log(password1);
                    return (password1 || password2) && !modelValue;
                };

                scope.$watch(password1Expression, function () {
                    ngModel.$validate();
                });
                scope.$watch(password2Expression, function () {
                    ngModel.$validate();
                });
            }
        }

    });