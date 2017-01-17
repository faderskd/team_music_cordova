angular.module("teamMusic")
    .controller("playlistListController", function ($scope, $http, $state, $stateParams, $ionicPopup, $compile,
                                                    $templateCache, ApiUrls) {


        // joining to playlists variables
        $scope.idOfPlaylistAssignedToJoin = -1;
        $scope.nameOfPlaylistAssignedToJoin = '';
        $scope.errors = {};
        $scope.data = {};

        $scope.show();
        $http({
            method: 'GET',
            url: ApiUrls.playlistUrl
        }).then(function successCallback(response) {
                $scope.playlists = response.data;
            }, function errorsCallback(response) {
            }
        ).finally(function () {
                $scope.hide();
            });


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

        $scope.deletePlaylist = function (playlist) {
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
        };

        // joining to playlists functions
        $scope.assignPlaylistToJoin = function (playlist) {
            $scope.idOfPlaylistAssignedToJoin = playlist.id;
            $scope.nameOfPlaylistAssignedToJoin = playlist.title;
        };

        var saveJoinToPlaylistForm = function (password, joinPopup) {
            $http({
                method: 'POST',
                data: {password: password},
                url: ApiUrls.playlistUrl + $scope.idOfPlaylistAssignedToJoin + '/join/'
            }).then(function successCallback(response) {
                joinPopup.close();
            }, function errorCallback(response) {
                $scope.errors = response.data;
            });
        };

        $scope.showPopup = function () {

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
    });