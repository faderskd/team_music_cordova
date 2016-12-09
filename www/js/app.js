// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('teamMusic', ['ionic', 'ngMessages', 'LocalStorageModule'])

    .run(function ($ionicPlatform, $rootScope, $location, $state, Account) {
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
                templateUrl: 'templates/no-logged/menu.html'
            })
            .state('no-logged.login', {
                url: '/login',
                templateUrl: 'templates/no-logged/loginForm.html',
                controller: 'loginFormController'
            })
            .state('no-logged.register', {
                url: '/register',
                templateUrl: 'templates/no-logged/registerForm.html',
                controller: 'registerFormController'
            });
        $urlRouterProvider.otherwise('/no-logged/login');

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://127.0.0.1:8000/**'
        ]);
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    })