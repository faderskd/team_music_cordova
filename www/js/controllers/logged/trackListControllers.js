angular.module("teamMusic")
    .controller("trackListController", function ($scope, $http, $state, Account, ApiUrls) {

        $http({
            method: 'GET',
            url: ApiUrls.tracksUrl
        }).then(function successCallback(response) {
                $scope.tracks = response.data;
            }, function errorsCallback(response) {
            }
        );

        // deleting tracks variables
        $scope.idOfTrackAssignedToDelete = -1;
        $scope.nameOfTrackAssignedToDelete = '';
        $scope.showDeleteTrackModal = true;
        $scope.showDelete = false;

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