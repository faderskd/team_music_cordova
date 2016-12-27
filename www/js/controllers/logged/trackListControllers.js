angular.module("teamMusic")
    .controller("trackListController", function ($scope, $http, $state, $stateParams, Account, ApiUrls, Permissions) {

        // deleting tracks variables
        $scope.idOfTrackAssignedToDelete = -1;
        $scope.nameOfTrackAssignedToDelete = '';
        $scope.showDeleteTrackModal = true;
        $scope.showDelete = false;

        $scope.show();
        $http({
            method: 'GET',
            url: ApiUrls.tracksUrl
        }).then(function successCallback(response) {
                $scope.tracks = response.data;
                $scope.tracksCopy = response.data;
            }, function errorsCallback(response) {
            }
        ).finally(function () {
                $scope.hide();
            });

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


        // deleting tracks functions
        $scope.assignTrackToDelete = function (track) {
            $scope.idOfTrackAssignedToDelete = track.id;
            $scope.nameOfTrackAssignedToDelete = track.title;
            $scope.showDeleteTrackModal = true;
        };
        $scope.deleteTrack = function () {
            if ($scope.idOfTrackAssignedToDelete > 0) {
                for (var i = 0; i < tracks.length; i++) {
                    if (tracks[i].id == $scope.idOfTrackAssignedToDelete) {

                        $http({
                            method: 'DELETE',
                            url: ApiUrls.tracksUrl + tracks[i].id + '/'
                        }).then(function successCallback(response) {
                            tracks.splice(i, 1);
                        }, function errorCallback(response) {
                        });
                        return;
                    }
                }
            }
        };

    });