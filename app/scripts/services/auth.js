/*global angular */

(function () {
    'use strict';

    angular.module('auth', ['Facebook', 'config'])
        .config(['FacebookProvider', 'config', function (FacebookProvider, config) {
            FacebookProvider.init(config.facebook.id);
        }])
        .factory('userService', function ($http, $window, $rootScope, alert) {
            var set = function (user) {
                $rootScope.user = user;
            };

            (function () {
                $http({ method: 'GET', url: '/api/me' }).then(
                    function (user) {
                        set(user.data);
                    },
                    function () {
                        alert.add('Error in retrieving user data.');
                    }
                );
            }());

            return {
                get: function () {
                    return $rootScope.user;
                },
                login: function () {
                    $window.location.href = '/auth/facebook';
                },
                logout: function () {
                    $http({ method: 'GET', url: '/logout' })
                        .success(function () {
                            set(undefined);
                        })
                        .error(function () {
                            alert.add('Error in logging out.', true);
                        });
                }
            };
        });
}());
