/*global angular */
/*jslint browser: true */
(function () {
    'use strict';

    var app;

    app = angular.module('thin.gsApp',
            ['ngRoute', 'ngResource', 'ngSanitize', 'ngTouch', 'pascalprecht.translate',
                'AngularGM', 'alerts', 'auth', 'centers', 'angular-google-analytics', 'config', 'angularMoment']
        )
        .config(['$routeProvider', '$locationProvider', 'AnalyticsProvider', '$translateProvider', 'config',
            function ($routeProvider, $locationProvider, AnalyticsProvider, $translateProvider, config) {
                $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    .when('/map', {
                        templateUrl: 'views/map.html',
                        controller: 'MapCtrl'
                    })
                    .when('/tos', {
                        templateUrl: 'views/tos.html'
                    })
                    .when('/history', {
                        templateUrl: 'views/history.html',
                        controller: 'HistoryCtrl'
                    })
                    .otherwise({
                        templateUrl: 'views/404.html'
                    });

                $locationProvider.html5Mode(true);
                $locationProvider.hashPrefix('!');

                $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
                $translateProvider.preferredLanguage('pt');

                $translateProvider.useStaticFilesLoader({
                    prefix: '/languages/',
                    suffix: '.json'
                });

                AnalyticsProvider.setAccount(config.googleAnalyticsId);
                AnalyticsProvider.trackPages(true);
                AnalyticsProvider.trackPrefix('my-application');
            }])
        .filter('us2date', function () {
            return function (input) {
                var out,
                    split = input.split('/');

                if (split.length === 3) {
                    out = split[2] + '-' + split[0] + '-' + split[1];
                }

                return out;
            };
        })
        .factory('moment', function ($window) {
            return $window.moment;
        });

    app.run(function ($rootScope, userService, alert, moment) {
        $rootScope.userService = userService;
        $rootScope.alert = alert;
        moment.lang('pt_BR');
    });
}());

