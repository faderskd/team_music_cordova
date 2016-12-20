angular.module("teamMusic")
    .controller("createTrackFormController", function ($scope, $state, $ionicPopup, ApiUrls, multipartForm) {

        $scope.errors = {};

        $scope.saveTrackForm = function (newTrack) {
            if ($scope.trackForm.$valid) {
                multipartForm.send(
                    ApiUrls.tracksUrl,
                    "POST",
                    newTrack
                ).then(
                    function successCallback(response) {
                        $ionicPopup.alert({
                            title: 'Track added successfully!',
                            template: ''
                        }).then(function (res) {
                            $state.go('logged.create-track', {}, {reload: true})
                        });
                    },
                    function errorsCallback(response) {
                        if (response.status == 400)
                            $scope.$apply(function () {
                                $scope.errors = response.data;
                            });
                    }
                );
            }
            $scope.trackForm.submitted = true;
        }
    })
    .controller("editTrackFormController", function ($scope, $http, $state, $stateParams, $ionicPopup, ApiUrls,
                                                     multipartForm) {

        var trackId = $stateParams.trackId;
        $scope.errors = {};

        $http({
            method: 'GET',
            url: ApiUrls.tracksUrl + trackId + '/'
        }).then(
            function successCallback(response) {
                $scope.track = response.data;

                var trackFileUrl = $scope.track.file_url;
                var splittedTrackFileUrl = trackFileUrl.split('/');

                $scope.savedFile = splittedTrackFileUrl[splittedTrackFileUrl.length - 1];
            },
            function errorCallback(response) {
            }
        );


        $scope.saveTrackForm = function (track) {
            if ($scope.trackForm.$valid) {
                multipartForm.send(
                    ApiUrls.tracksUrl + trackId + '/',
                    "PUT",
                    track
                ).then(
                    function successCallback(response) {
                        $ionicPopup.alert({
                            title: 'Track updated successfully!',
                            template: ''
                        }).then(function (res) {
                        });
                    },
                    function errorsCallback(response) {
                        if (response.status == 400)
                            $scope.$apply(function () {
                                $scope.errors = response.data;
                            });
                    }
                );
            }
            $scope.trackForm.submitted = true;
        }
    })
    .directive('onChangeUpdateName', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, el, attrs, ngModel) {
                //change event is fired when file is selected
                el.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
                });
            }
        }
    })
    .directive('onChangeUpdateFileModel', function ($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs) {
                var fileModel = $parse(attrs.onChangeUpdateFileModel);
                var modelSetter = fileModel.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        var uploadedFile = element[0].files[0];
                        modelSetter(scope, uploadedFile);
                    });
                });
            }
        }
    })
    .directive('checkSize', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('change', function () {
                    scope.$apply(function () {
                        var uploadedFile = element[0].files[0];
                        if (uploadedFile) {
                            var size = parseInt(attrs.checkSize);
                            if (uploadedFile.size > size * 1024 * 1024) {
                                ngModel.$setValidity('size' + size, false);
                                return
                            }
                            ngModel.$setValidity('size' + size, true);
                        }
                    });
                });
            }
        }
    })
    .service('multipartForm', function ($http) {
        this.send = function (uploadUrl, method, data) {
            return new Promise(function (fulfill, reject) {
                var formData = new FormData();
                for (var key in data) {
                    if (data[key])
                        formData.append(key, data[key]);
                }

                $http({
                    method: method,
                    url: uploadUrl,
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function successCallback(response) {
                        fulfill(response);
                    },
                    function errorCallback(response) {
                        reject(response);
                    }
                );
            });
        }
    }
);