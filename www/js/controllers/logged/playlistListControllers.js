angular.module("teamMusic")
    .controller("playlistListController", function ($scope, $http, $state, $stateParams, $ionicPopup, $compile,
                                                    $templateCache, ApiUrls) {


        // joining to playlist variables
        $scope.idOfPlaylistAssignedToJoin = -1;
        $scope.nameOfPlaylistAssignedToJoin = '';
        $scope.errors = {};
        $scope.data = {};


        // searching playlist by title
        $scope.searchPlaylists = function (title) {
            $http({
                method: 'GET',
                url: ApiUrls.playlistUrl + '?title=' + title
            }).then(function successCallback(response) {
                    $scope.playlists = response.data;
                }, function errorsCallback(response) {
                }
            );
        };

        // deleting playlist
        $scope.showConfirmPlaylistDeletion = function (playlist) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure you want to delete playlist ' + playlist.title + ' ?',
                template: ''
            });

            confirmPopup.then(function (res) {
                if (res) {
                    deletePlaylist(playlist);
                }
            });
        };

        function deletePlaylist(playlist) {
            for (var i = 0; i < $scope.playlists.length; i++) {
                if ($scope.playlists[i].id == playlist.id) {

                    $http({
                        method: 'DELETE',
                        url: ApiUrls.playlistUrl + playlist.id + '/'
                    }).then(function successCallback(response) {
                        $scope.playlists.splice(i, 1);
                    }, function errorCallback(response) {
                    });
                    return;
                }
            }
        }

        // joining to playlist
        $scope.assignPlaylistToJoin = function (playlist) {
            $scope.idOfPlaylistAssignedToJoin = playlist.id;
            $scope.nameOfPlaylistAssignedToJoin = playlist.title;
        };

        $scope.showJoinPopup = function () {

            var joinPopup = $ionicPopup.show({
                templateUrl: 'templates/logged/joinPlaylistForm.html',
                title: 'Enter playlist password',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positie',
                        onTap: function (e) {
                            e.preventDefault();
                            $scope.setErrorIfNoPassword($scope.data.password);
                            if ($scope.data.password) {
                                saveJoinToPlaylistForm($scope.data.password, joinPopup);
                            }
                        }
                    }
                ]
            });

            $scope.setErrorIfNoPassword = function (password) {
                if (!password) {
                    $scope.errors.password = ['This field is required']
                }
                else {
                    $scope.errors.password = undefined;
                }
            };

        };

        function saveJoinToPlaylistForm(password, joinPopup) {
            $http({
                method: 'POST',
                data: {password: password},
                url: ApiUrls.playlistUrl + $scope.idOfPlaylistAssignedToJoin + '/join/'
            }).then(function successCallback(response) {
                joinPopup.close();
                $state.go('logged.edit-playlist', {'playlistId': $scope.idOfPlaylistAssignedToJoin}, {reload: true});
            }, function errorCallback(response) {
                $scope.errors = response.data;
            });
        }

        // leaving playlist
        $scope.showConfirmPlaylistLeave = function (playlist) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure you want to leave playlist ' + playlist.title + ' ?',
                template: ''
            });

            confirmPopup.then(function (res) {
                if (res) {
                    leavePlaylist(playlist);
                }
            });
        };

        function leavePlaylist(playlist) {
            for (var i = 0; i < $scope.playlists.length; i++) {
                if ($scope.playlists[i].id == playlist.id) {

                    $http({
                        method: "POST",
                        url: ApiUrls.playlistUrl + playlist.id + '/leave/'
                    }).then(
                        function successCallback(response) {
                            $scope.playlists.splice(i, 1);
                        },
                        function errorCallback(response) {
                        });
                    return;
                }
            }
        }

        // fetching playlist from server
        $http({
            method: 'GET',
            url: ApiUrls.playlistUrl
        }).then(function successCallback(response) {
                $scope.playlists = response.data;
            }, function errorsCallback(response) {
            }
        )

    }
);