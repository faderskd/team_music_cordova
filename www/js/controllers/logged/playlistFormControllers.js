angular.module('teamMusic')
    .controller("createPlaylistFormController", function ($scope, $http, $state, $ionicPopup, ApiUrls) {

        $scope.errors = {};

        $scope.savePlaylistForm = function (newPlaylist) {
            if ($scope.playlistForm.$valid) {
                $http({
                    method: 'POST',
                    url: ApiUrls.playlistUrl,
                    data: newPlaylist
                }).then(
                    function successCallback(response) {
                        $ionicPopup.alert({
                            title: 'Playlist added successfully!',
                            template: ''
                        }).then(function (res) {
                            $state.go('logged.create-playlist', {}, {reload: true})
                        });
                    },
                    function errorsCallback(response) {
                        if (response.status == 400)
                            $scope.errors = response.data;
                    }
                );
            }
            $scope.playlistForm.submitted = true;
        }

    }).
    controller("editPlaylistFormController", function ($scope, $http, $state, $stateParams, $ionicPopup, ApiUrls,
                                                       Permissions, Account) {
        var playlistId = $stateParams.playlistId;
        $scope.errors = {};

        // form is hidden in tab so must be defined before firstly
        $scope.searchedTracks = [];
        $scope.previouslySearchedTracks = [];

        $http({
            method: 'GET',
            url: ApiUrls.playlistUrl + playlistId + '/'
        }).then(
            function successCallback(response) {
                var playlist = response.data;
                var isAdminEditor = Permissions.isAdminEditor(Account.getUser(), playlist);
                var isEditor = Permissions.isEditor(Account.getUser(), playlist);

                $scope.playlist = playlist;
                $scope.isAdminEditor = isAdminEditor;
                $scope.isEditor = isEditor;
            },
            function errorCallback(response) {
            }
        );

        $scope.savePlaylistForm = function (playlist) {
            if ($scope.playlistForm.$valid) {
                $http({
                    method: "PUT",
                    url: ApiUrls.playlistUrl + playlistId + '/',
                    data: playlist
                }).then(
                    function successCallback(response) {
                        $ionicPopup.alert({
                            title: 'Playlist added successfully!',
                            template: ''
                        });
                    },
                    function errorsCallback(response) {
                        if (response.status == 400)
                            $scope.errors = response.data;
                    }
                );
            }
            $scope.playlistForm.submitted = true;
        };

        $scope.leavePlaylist = function (playlist) {
            $http({
                method: "POST",
                url: ApiUrls.playlistUrl + playlist.id + '/leave/'
            }).then(
                function successCallback(response) {
                    $location.path('/playlists');
                },
                function errorCallback(response) {
                }
            )
        };

        $scope.toggleEditor = function (editor, playlist) {
            if (!editor.is_blocked_editor) {
                $http({
                    method: "POST",
                    url: ApiUrls.playlistUrl + playlist.id + '/block-editor/' + editor.id + '/'
                }).then(
                    function successCallback(response) {
                        editor.is_blocked_editor = true;
                    },
                    function errorCallback(response) {
                    }
                )
            }
            else {
                $http({
                    method: "POST",
                    url: ApiUrls.playlistUrl + playlist.id + '/activate-editor/' + editor.id + '/'
                }).then(
                    function successCallback(response) {
                        editor.is_blocked_editor = false;
                    },
                    function errorCallback(response) {
                    }
                )
            }
        };

        $scope.searchTracks = function (title, playlist) {
            if (angular.isString(title) && title.length > 2) {
                $http({
                    method: 'GET',
                    url: ApiUrls.tracksUrl + '?title=' + title
                }).then(function successCallback(response) {
                        var searchedTracks = [];
                        for (var i = 0; i < response.data.length; i++) {
                            searchedTracks.push(response.data[i]);
                            for (var j = 0; j < playlist.tracks.length; j++) {
                                if (playlist.tracks[j].id == response.data[i].id) {
                                    searchedTracks[i].trackInPlaylist = true;
                                    break;
                                }
                                searchedTracks[i].trackInPlaylist = false;
                            }
                        }
                        $scope.searchedTracks = searchedTracks;
                        $scope.previouslySearchedTracks = searchedTracks;
                    }, function errorsCallback(response) {
                    }
                );
            }
            else {
                $scope.searchedTracks = [];
            }
        };

        $scope.clearSearchedTracks = function () {
            $scope.searchedTracks = [];
        };

        $scope.addTrackToPlaylist = function (track, playlist) {
            $http({
                method: 'POST',
                url: ApiUrls.playlistUrl + playlist.id + '/add-track/' + track.id + '/'
            }).then(function successCallback(response) {
                if (response.data.created) {
                    playlist.tracks.push(track);
                    track.trackInPlaylist = true;
                }
            });
        };

        $scope.removeTrackFromPlaylist = function (track, playlist) {
            $http({
                method: 'POST',
                url: ApiUrls.playlistUrl + playlist.id + '/delete-track/' + track.id + '/'
            }).then(
                function successCallback(response) {
                    for (var i = 0; i < playlist.tracks.length; i++) {
                        if ($scope.playlist.tracks[i].id == track.id) {
                            $scope.playlist.tracks.splice(i, 1);
                            track.trackInPlaylist = false;
                            return;
                        }
                    }
                }
            )
        };

        $scope.loadPreviouslySearchedTracks = function (title) {
            if (angular.isString(title) && title.length > 2) {
                $scope.searchedTracks = $scope.previouslySearchedTracks;
            }
        }
    });