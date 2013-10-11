/*global angular */

(function () {
    'use strict';

    angular.module('thin.gsApp')
        .factory('listItems', function ($resource) {
            return $resource(
                '/api/history/:id',
                {id: '@id'}
            );
        })
        .controller('HistoryCtrl', function ($scope, alert, listItems, moment) {
            $scope.list = listItems.query();
            $scope.itemDate = moment().format('YYYY-MM-DD');

            $scope.addNewItem = function () {
                listItems.save({
                    'date': $scope.itemDate,
                    'place': $scope.itemPlace
                }).$promise.then(
                    function (data) {
                        $scope.list.push(data);
                        $scope.itemDate = moment().format('YYYY-MM-DD');
                        $scope.itemPlace = '';
                    },
                    function () {
                        alert.add('Error adding item to the history records.');
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
        });
}());
