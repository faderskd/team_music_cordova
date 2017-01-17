angular.module('teamMusic')
    .directive('onChangeClearServerError', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                angular.forEach(element.find('input'), function (v, k) {
                    var input = angular.element(v);
                    var errorName = input.attr('ng-model').split('.');
                    errorName = errorName[errorName.length-1];
                    var errorSetter = $parse('errors.' + errorName).assign;
                    input.bind('change', function () {
                        scope.$apply(function () {
                            errorSetter(scope, '');
                        });
                    });
                });
            }
        }
    });