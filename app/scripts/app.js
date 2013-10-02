/*global angular */
/*jslint browser: true */
(function () {
    'use strict';

    var app;

    app = angular.module('thin.gsApp', ['ngRoute', 'ngSanitize', 'alerts', 'auth'])
        .config(['$routeProvider', '$locationProvider',
            function ($routeProvider, $locationProvider) {
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
            }]);

    app.run(function ($rootScope, Facebook, alert) {
    });
}());

