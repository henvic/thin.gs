/*global angular */

(function () {
    'use strict';

    angular.module('centers', [])
        .factory('centers', function ($resource) {
            return $resource('/api/centers.json');
        });
}());
