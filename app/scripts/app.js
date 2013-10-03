/*global angular */
/*jslint browser: true */
(function () {
    'use strict';

    var app;

    app = angular.module('thin.gsApp', [
        'ngRoute', 'ngSanitize', 'alerts', 'auth', 'angular-google-analytics', 'config'
    ])
        .config(['$routeProvider', '$locationProvider', 'AnalyticsProvider', 'config',
            function ($routeProvider, $locationProvider, AnalyticsProvider, config) {
                $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

                $locationProvider.html5Mode(true);
                $locationProvider.hashPrefix('!');

                AnalyticsProvider.setAccount(config.googleAnalyticsId);
                AnalyticsProvider.trackPages(true);
                AnalyticsProvider.trackPrefix('my-application');
            }]);

    app.run(function ($rootScope, userService, alert) {
        $rootScope.userService = userService;
        $rootScope.alert = alert;
    });
}());

