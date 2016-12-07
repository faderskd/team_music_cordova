angular.module("teamMusic")
    .factory("ApiUrls", function () {
        var serverPrefix = 'http://localhost:8000/';
        return {
            registerUrl: serverPrefix + 'register/',
            loginUrl: serverPrefix + 'login/',
            tracksUrl: serverPrefix + 'tracks/',
            playlistUrl: serverPrefix + 'playlists/',
            usersUrl: serverPrefix + 'users/'
        }
    });