/*global angular */

(function () {
    'use strict';

    angular.module('centers', [])
        .factory('centers', ['$resource', function ($resource) {
            return $resource('/api/centers.json');
        }]);
}());
