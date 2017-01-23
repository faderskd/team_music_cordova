// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('teamMusic', ['ionic', 'ngMessages', 'LocalStorageModule', 'ionic-audio'])

    .run(function ($ionicPlatform, $rootScope, $state, Account) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            var user = Account.loadUserFromCookie();
            if (user) {
                $state.go('logged.track-list');
            }
            else {
                $state.go('no-logged.login');
            }

            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            });

        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('teamMusic');

        $stateProvider
            .state('no-logged', {
                url: '/no-logged',
                templateUrl: 'templates/no-logged/menu.html',
                abstract: true
            })
            .state('no-logged.login', {
                url: '/login',
                templateUrl: 'templates/no-logged/loginForm.html',
                controller: 'loginFormController',
                cache: false
            })
            .state('no-logged.register', {
                url: '/register',
                templateUrl: 'templates/no-logged/registerForm.html',
                controller: 'registerFormController',
                cache: false
            })
            .state('logged', {
                url: '/logged',
                templateUrl: 'templates/logged/menu.html',
                abstract: true
            })
            .state('logged.settings', {
                url: '/settings',
                templateUrl: 'templates/logged/settingsForm.html',
                controller: 'settingsFormController',
                cache: false
            })
            .state('logged.track-list', {
                url: '/track-list',
                templateUrl: 'templates/logged/trackList.html',
                controller: 'trackListController',
                cache: false
            })
            .state('logged.create-track', {
                url: '/create-track',
                templateUrl: 'templates/logged/createTrackForm.html',
                controller: 'createTrackFormController',
                cache: false
            })
            .state('logged.edit-track', {
                url: '/edit-track/:trackId',
                templateUrl: 'templates/logged/editTrackForm.html',
                controller: 'editTrackFormController',
                cache: false
            })
            .state('logged.playlist-list', {
                url: '/playlist-list',
                templateUrl: 'templates/logged/playlistList.html',
                controller: 'playlistListController',
                cache: false
            })
            .state('logged.create-playlist', {
                url: '/create-playlist',
                templateUrl: 'templates/logged/createPlaylistForm.html',
                controller: 'createPlaylistFormController',
                cache: false
            })
            .state('logged.edit-playlist', {
                url: '/edit-playlist:playlistId',
                templateUrl: 'templates/logged/editPlaylistForm.html',
                controller: 'editPlaylistFormController',
                cache: false
            });


        $urlRouterProvider.otherwise('/no-logged/login');

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://127.0.0.1:8000/**'
        ]);
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push("authorizationInterceptor");
        $httpProvider.interceptors.push("unauthorizedInterceptor");
    })
    .controller("teamMusicController", function ($scope, $ionicLoading) {
        $scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        }

    });