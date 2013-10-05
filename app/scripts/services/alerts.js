/*global angular */
/*jslint unparam: true */

(function () {
    'use strict';

    angular.module('alerts', [])
        .factory('alert', function ($rootScope, $timeout) {
            return {
                add: function (msg) {
                    $timeout(function () {
                        $rootScope.$broadcast('alertNewMessage', msg);
                    }, 300);
                }
            };
        })
        .controller('AlertsCtrl', function ($sanitize, $scope, $rootScope) {
            $scope.alerts = [
            ];

            $scope.alerts.add = function (msg) {
                $scope.alerts.push({raw: $sanitize(msg)});
            };

            $scope.alerts.remove = function (index) {
                $scope.alerts.splice(index, 1);
            };

            $rootScope.$on('alertNewMessage', function (e, msg) {
                $scope.alerts.add(msg);
            });
        });
}());
