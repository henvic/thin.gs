/*global angular */
/*jslint browser: true */

angular.module('thin.gsApp', [])
    .config(function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
