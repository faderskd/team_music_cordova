angular.module("teamMusic")
    .controller("playlistListController", function ($scope, $http, $state, $stateParams, ApiUrls) {

        // searching by title
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

        var searchedPlaylistTitle = $routeParams.title;

        if (angular.isString(searchedPlaylistTitle) && searchedPlaylistTitle.length > 2) {
            $scope.searchPlaylists(searchedPlaylistTitle, 10);
            $scope.searchView = true;
        }
        else {
            $http({
                method: 'GET',
                url: ApiUrls.playlistUrl
            }).then(function successCallback(response) {
                    $scope.playlists = response.data;
                }, function errorsCallback(response) {
                }
            );
        }

        //redirect to searchView
        $scope.redirectToSearch = function (title) {
            $location.search('title', title);
        };

        // pagination variables
        $scope.selectedPage = 1;
        $scope.playlistListPageSize = playlistListPageCount;

        // deleting playlists variables
        $scope.idOfPlaylistAssignedToDelete = -1;
        $scope.nameOfPlaylistAssignedToDelete = '';


        // joining to playlists variables
        $scope.idOfPlaylistAssignedToJoin = -1;
        $scope.nameOfPlaylistAssignedToJoin = '';
        $scope.errors = {};

        // pagination functions
        $scope.selectPage = function (page) {
            $scope.selectedPage = page;
        };
        $scope.getPageClass = function (page) {
            return $scope.selectedPage == page ? playlistListActivePage : playlistListInactivePage;
        };

        // deleting playlists functions
        $scope.assignPlaylistToDelete = function (playlist) {
            $scope.idOfPlaylistAssignedToDelete = playlist.id;
            $scope.nameOfPlaylistAssignedToDelete = playlist.title;
        };

        $scope.deleteAssignedPlaylist = function (playlists) {
            if ($scope.idOfPlaylistAssignedToDelete > 0 && angular.isArray(playlists)) {
                for (var i = 0; i < playlists.length; i++) {
                    if (playlists[i].id == $scope.idOfPlaylistAssignedToDelete) {

                        $http({
                            method: 'DELETE',
                            url: ApiUrls.playlistUrl + playlists[i].id + '/'
                        }).then(function successCallback(response) {
                            playlists.splice(i, 1);
                        }, function errorCallback(response) {
                        });
                        return;
                    }
                }
            }
        };

        // joining to playlists functions
        $scope.assignPlaylistToJoin = function (playlist) {
            $scope.idOfPlaylistAssignedToJoin = playlist.id;
            $scope.nameOfPlaylistAssignedToJoin = playlist.title;
        };

        $scope.saveJoinToPlaylistForm = function (password) {
            if ($scope.joinToPlaylistForm.$valid) {
                $http({
                    method: 'POST',
                    data: {password: password},
                    url: ApiUrls.playlistUrl + $scope.idOfPlaylistAssignedToJoin + '/join/'
                }).then(function successCallback(response) {

                    $("#join-to-playlist-modal-form").modal("toggle");
                    $location.path('/playlists/edit/' + $scope.idOfPlaylistAssignedToJoin);
                    Messages.setMessage("Now you are editor of playlist " + $scope.nameOfPlaylistAssignedToJoin + ' !');

                }, function errorCallback(response) {

                    if (response.status == 400)
                        $scope.errors = response.data;

                    if (response.status == 404)
                        $("#join-to-playlist-modal-form").modal("toggle");

                });
            }
            $scope.joinToPlaylistForm.submitted = true;
        };

    });