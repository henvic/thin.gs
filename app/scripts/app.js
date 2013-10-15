/*global angular */
/*jslint browser: true */
(function () {
    'use strict';

    var app;

    app = angular.module('thin.gsApp',
            ['ngRoute', 'ngResource', 'ngSanitize',
                'AngularGM', 'alerts', 'auth', 'angular-google-analytics', 'config', 'angularMoment']
        )
        .config(['$routeProvider', '$locationProvider', 'AnalyticsProvider', 'config',
            function ($routeProvider, $locationProvider, AnalyticsProvider, config) {
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

