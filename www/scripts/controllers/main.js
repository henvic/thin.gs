/*global angular */

(function () {
    'use strict';

    angular.module('thin.gsApp')
        .controller('MainCtrl', ['$scope', 'userService', 'alert', function ($scope, userService, alert) {
            $scope.bloods = [
                {value: 'A', text: 'A'},
                {value: 'B', text: 'B'},
                {value: 'AB', text: 'AB'},
                {value: 'O', text: 'O'},
                {value: '', text: 'não definido'}
            ];

            $scope.rhs = [
                {value: '-', text: '-'},
                {value: '+', text: '+'},
                {value: '', text: 'não definido'}
            ];

            $scope.set = function () {
                var data = {
                    blood: $scope.user.blood,
                    notifications: $scope.user.notifications
                };

                userService.save(data, function (err) {
                    if (err) {
                        alert.add('Error setting your preferences. We advise you to reload this application.');
                    }
                });
            };
        }]);
}());
