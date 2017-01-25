angular.module("teamMusic")
    .controller("trackListController", function ($scope, $http, $state, $stateParams, $ionicPopup, Account, ApiUrls, Permissions) {

        $scope.searchTracks = function (title) {
            if (title.length > 2) {
                $scope.show();
                $http({
                    method: 'GET',
                    url: ApiUrls.tracksUrl + '?title=' + title
                }).then(function successCallback(response) {
                        $scope.tracks = response.data;
                    }, function errorsCallback(response) {
                    }
                ).finally(function () {
                        $scope.hide();
                    });
            }
            else {
                $scope.tracks = $scope.tracksCopy;
            }
        };


        $scope.isTrackOwner = function (track) {
            return Permissions.hasObjectPermission(Account.getUser(), track);
        };

        $scope.showConfirmTrackDeletion = function (track) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure you want to delete track ' + track.title + ' ?',
                template: ''
            });

            confirmPopup.then(function (res) {
                if (res) {
                    deleteTrack(track);
                }
            });

        };

        function deleteTrack(track) {
            for (var i = 0; i < $scope.tracks.length; i++) {
                if ($scope.tracks[i].id == track.id) {
                    $http({
                        method: 'DELETE',
                        url: ApiUrls.tracksUrl + $scope.tracks[i].id + '/'
                    }).then(function successCallback(response) {
                        $scope.tracks.splice(i, 1);
                    }, function errorCallback(response) {
                    });
                    return;
                }
            }
        }

        // fetching track list from server
        $http({
            method: 'GET',
            url: ApiUrls.tracksUrl
        }).then(function successCallback(response) {
                $scope.tracks = response.data;
                $scope.tracksCopy = response.data;
            }, function errorsCallback(response) {
            }
        )
    });