/*global angular */

(function () {
    'use strict';

    angular.module('auth', ['Facebook', 'config'])
        .config(['FacebookProvider', 'config', function (FacebookProvider, config) {
            FacebookProvider.init(config.facebook.id);
        }])
        .factory('userService', ['$http', '$window', '$q', '$rootScope', 'alert',
            function ($http, $window, $q, $rootScope, alert) {
                var set,
                    defer = $q.defer(),
                    end = true;

                set = function (user) {
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
                        $http({ method: 'POST', url: '/logout' })
                            .success(function () {
                                set(undefined);
                            })
                            .error(function () {
                                alert.add('Error in logging out.', true);
                            });
                    },
                    save: function (data, callback) {
                        if (!end) {
                            defer.resolve();
                        }

                        return $http({method: 'POST', url: '/api/me', timeout: defer.promise, data: data})
                            .success(function (feedback) {
                                end = true;
                                callback(false, feedback);
                            })
                            .error(function () {
                                end = true;
                                callback(true);
                            });
                    }
                };
            }]);
}());
