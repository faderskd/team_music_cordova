angular.module('teamMusic')
    .directive('onChangeClearServerError', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                angular.forEach(element.find('input'), function (v, k) {
                    var input = angular.element(v);
                    var errorName = input.attr('ng-model').split('.');
                    if (errorName.length > 0) {
                        errorName = errorName[1];
                    }
                    else {
                        errorName = errorName[0]
                    }
                    var errorSetter = $parse('errors.' + errorName).assign;
                    input.bind('keyup', function () {
                        scope.$apply(function () {
                            errorSetter(scope, '');
                        });
                    });
                });
            }
        }
    });