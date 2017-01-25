angular.module('teamMusic')
    .controller("createPlaylistFormController", function ($scope, $http, $state, $ionicPopup, ApiUrls) {

        $scope.errors = {};
        $scope.newPlaylist = {};

        $scope.savePlaylistForm = function () {
            if ($scope.playlistForm.$valid) {
                $http({
                    method: 'POST',
                    url: ApiUrls.playlistUrl,
                    data: $scope.newPlaylist
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
    controller("editPlaylistFormController", function ($scope, $http, $state, $stateParams, $ionicPopup, $ionicModal,
                                                       $ionicSlideBoxDelegate, ApiUrls, Permissions, Account) {

        var playlistId = $stateParams.playlistId;

        $scope.errors = {};
        $scope.playlist = {};
        $scope.activeIndex = 0;
        $scope.showReorder = false;
        $scope.modalData = {
            searchedTracks: [],
            searchTrackTitle: '',
            tracksCopy: []
        };

        // reordering tracks in playlist
        $scope.moveItem = function (track, fromIndex, toIndex) {
            //Move the item in the array
            var track = $scope.playlist.tracks.splice(fromIndex, 1);
            $scope.playlist.tracks.splice(toIndex, 0, track[0]);
        };

        // slides management
        $scope.onSlideChangeStart = function (index) {
            $scope.activeIndex = index;
        };

        $scope.rightSlide = function () {
            $ionicSlideBoxDelegate.next();
        };

        $scope.leftSlide = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // editing playlist settings
        $scope.savePlaylistForm = function () {
            if ($scope.playlistForm.$valid) {
                $http({
                    method: "PUT",
                    url: ApiUrls.playlistUrl + playlistId + '/',
                    data: $scope.playlist
                }).then(
                    function successCallback(response) {
                        $ionicPopup.alert({
                            title: 'Playlist updated successfully!',
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

        // blocking/unblocking editors
        $scope.toggleEditor = function (editor) {
            if (!editor.is_blocked_editor) {
                $http({
                    method: "POST",
                    url: ApiUrls.playlistUrl + $scope.playlist.id + '/block-editor/' + editor.id + '/'
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
                    url: ApiUrls.playlistUrl + $scope.playlist.id + '/activate-editor/' + editor.id + '/'
                }).then(
                    function successCallback(response) {
                        editor.is_blocked_editor = false;
                    },
                    function errorCallback(response) {
                    }
                )
            }
        };

        $scope.addTrackToPlaylist = function (track) {
            $http({
                method: 'POST',
                url: ApiUrls.playlistUrl + $scope.playlist.id + '/add-track/' + track.id + '/'
            }).then(function successCallback(response) {
                if (response.data.created) {
                    $scope.playlist.tracks.push(track);
                    track.trackInPlaylist = true;
                }
            });
        };

        $scope.removeTrackFromPlaylist = function (track) {
            $http({
                method: 'POST',
                url: ApiUrls.playlistUrl + $scope.playlist.id + '/delete-track/' + track.id + '/'
            }).then(
                function successCallback(response) {
                    for (var i = 0; i < $scope.playlist.tracks.length; i++) {
                        if ($scope.playlist.tracks[i].id == track.id) {
                            $scope.playlist.tracks.splice(i, 1);
                            track.trackInPlaylist = false;
                            return;
                        }
                    }
                }
            )
        };

        // searching tracks for adding to playlist
        $scope.searchTracks = function (title) {
            if (title.length > 2) {
                $http({
                    method: 'GET',
                    url: ApiUrls.tracksUrl + '?title=' + title
                }).then(function successCallback(response) {
                        var searchedTracks = [];
                        for (var i = 0; i < response.data.length; i++) {
                            searchedTracks.push(response.data[i]);
                            for (var j = 0; j < $scope.playlist.tracks.length; j++) {
                                if ($scope.playlist.tracks[j].id == response.data[i].id) {
                                    searchedTracks[i].trackInPlaylist = true;
                                    break;
                                }
                                searchedTracks[i].trackInPlaylist = false;
                            }
                        }
                        $scope.modalData.searchedTracks = searchedTracks;
                        $scope.modalData.tracksCopy = searchedTracks;
                    }, function errorsCallback(response) {
                    }
                );
            }
            else {
                $scope.searchedTracks = $scope.tracksCopy;
            }
        };

        // adding to playlist modal management
        $ionicModal.fromTemplateUrl('templates/logged/addTrackToPlaylistModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addTrackToPlaylistModal = modal;
        });

        $scope.openModal = function () {
            $scope.addTrackToPlaylistModal.show();
        };

        $scope.closeModal = function () {
            $scope.addTrackToPlaylistModal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.addTrackToPlaylistModal.remove();
        });


        // fetching playlist from server
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

                if (isAdminEditor)
                    $scope.numberOfSlides = 3;
                else
                    $scope.numberOfSlides = 2;

                // because of async nature of http service update slides based on permissions received from server
                // together with playlist data
                $ionicSlideBoxDelegate.update();
            },
            function errorCallback(response) {
            }
        );

    });