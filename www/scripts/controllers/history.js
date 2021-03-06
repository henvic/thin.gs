/*global angular */

(function () {
    'use strict';

    var calculateAge = function (birthDate, otherDate) {
        var years;

        birthDate = new Date(birthDate || new Date());
        otherDate = new Date(otherDate || new Date());

        years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (otherDate.getMonth() < birthDate.getMonth() ||
                (otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())) {
            years -= 1;
        }

        return years;
    };

    angular.module('thin.gsApp')
        .factory('listItems', ['$resource', function ($resource) {
            return $resource(
                '/api/history/:id',
                {id: '@id'}
            );
        }])
        .directive('nextDonation', ['moment', '$filter', 'userService', function (moment, $filter, userService) {
            var orderBy = $filter('orderBy'),
                birthday = userService.get().facebook.birthday,
                age = calculateAge(birthday),
                minAfter = (age < 60) ? 90 : 180;

            return {
                restrict : 'A',
                templateUrl: 'views/donation/info.html',
                link: function (scope) {
                    scope.age = age;
                    scope.$watch("list", function () {
                        var last = orderBy(scope.list, '-date')[0],
                            minDate,
                            d;

                        if (last && last.date) {
                            minDate = last.date;
                        }

                        d = moment(minDate, "YYYY-MM-DD").add('days', minAfter);

                        if (d < moment()) {
                            scope.waitToDonate = false;
                            return;
                        }

                        scope.waitToDonate = d.fromNow() + ' (' + d.calendar() + ')';
                    }, true);
                }
            };
        }])
        .controller('HistoryCtrl', ['$scope', 'alert', 'listItems', 'centers', 'moment',
            function ($scope, alert, listItems, centers, moment) {
                $scope.list = listItems.query();

                $scope.centers = centers.query();

                $scope.newItem = {
                    date: moment().format('YYYY-MM-DD'),
                    place: '',
                    finishedState: true
                };

                $scope.addNewItem = function () {
                    $scope.newItem.finishedState = false;

                    listItems.save({
                        date: $scope.newItem.date,
                        place: $scope.newItem.place
                    }).$promise.then(function (data) {
                        $scope.list.push(data);
                        $scope.newItem.date = moment().format('YYYY-MM-DD');
                        $scope.newItem.place = '';
                    },
                        function () {
                            alert.add('Error adding item to the history records.');
                        }).then(
                        function () {
                            $scope.newItem.finishedState = true;
                        }
                    );
                };

                $scope.deleteItem = function (item) {
                    item.$remove().then(
                        function () {
                            $scope.list.splice($scope.list.indexOf(item), 1);
                        },
                        function () {
                            alert.add('Error removing item from the history records.');
                        }
                    );
                };
            }]);
}());
