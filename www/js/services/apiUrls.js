angular.module("teamMusic")
    .factory("ApiUrls", function () {
        var serverPrefix = 'http://192.168.1.15:8000/';
        return {
            registerUrl: serverPrefix + 'register/',
            loginUrl: serverPrefix + 'login/',
            tracksUrl: serverPrefix + 'tracks/',
            playlistUrl: serverPrefix + 'playlists/',
            usersUrl: serverPrefix + 'users/'
        }
    });