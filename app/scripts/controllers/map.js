/*global angular */

(function () {
    'use strict';

    angular.module('thin.gsApp')
        .directive('place', function () {
            return {
                restrict: 'A',
                templateUrl: 'views/map/place.html'
            };
        })
        .controller('MapCtrl', ['$scope', '$window', '$timeout', 'alert', 'centers',
            function ($scope, $window, $timeout, alert, centers) {
                var brazilCoordinates = {lat: -10.6500, long: -52.9500},
                    google = $window.google;

                $scope.mapSettings = {
                    zoom: 3
                };

                $scope.newItem = {};

                $scope.limit = 100000;

                $scope.end = true;

                $scope.options = {
                    map: {
                        center: new google.maps.LatLng(brazilCoordinates.lat, brazilCoordinates.long),
                        zoom: $scope.mapSettings.zoom,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    places: {
                        icon: {
                            url: '/images/drop-2.png',
                            scaledSize: new google.maps.Size(15, 20)
                        }
                    },
                    currentLocation: {
                        icon: {
                            url: '/images/current-location-glow.png',
                            scaledSize: new google.maps.Size(34, 34)
                        }
                    },
                    selected: {
                        icon: {
                            url: '/images/drop-3.png',
                            scaledSize: new google.maps.Size(15, 20)
                        }
                    }
                };

                $scope.places = centers.query();

                $scope.getPlaceOpts = function (place) {
                    return angular.extend(
                        { title: place.name, animation: google.maps.Animation.DROP },
                        $scope.options.places
                    );
                };

                $scope.orderByDistance = function (option) {
                    if (option === 'closest') {
                        $scope.limit = 5;
                        $scope.predicate = 'distance';
                        return;
                    }

                    $scope.limit = 100000;
                    $scope.predicate = '';
                };

                $scope.selectPlace = function (place, marker) {
                    if ($scope.prev) {
                        $scope.prev.setOptions($scope.options.places);
                    }

                    $scope.prev = marker;

                    marker.setOptions($scope.options.selected);

                    marker.setAnimation(google.maps.Animation.BOUNCE);

                    $timeout(function () {
                        marker.setAnimation(null);
                    }, 1440);

                    $scope.place = place;

                    $scope.newItem.place = marker.title;
                };

                $scope.resetPreviousMarker = function () {
                    $scope.prev.setOptions($scope.options.places);
                };

                $scope.setCenter = function (position) {
                    $scope.center = position;
                };

                $scope.getDistance = function (item) {
                    var coords,
                        userCoords,
                        p1,
                        p2,
                        distance;

                    if (!item || !item.location) {
                        return '';
                    }

                    coords = item.location;

                    if (!coords.lat || !coords.lng || !$scope.position) {
                        return '';
                    }

                    userCoords = $scope.position.coords;

                    p1 = new google.maps.LatLng(coords.lat, coords.lng);
                    p2 = new google.maps.LatLng(userCoords.latitude, userCoords.longitude);

                    distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000;

                    item.distance = distance;

                    if (distance > 100) {
                        return distance.toFixed(0) + 'km';
                    }

                    return distance.toFixed(2) + 'km';
                };

                $scope.findMe = function () {
                    if (!$window.navigator.geolocation) {
                        return;
                    }

                    $window.navigator.geolocation.getCurrentPosition(function (position) {
                        var latitude = position.coords.latitude,
                            longitude = position.coords.longitude;

                        $scope.position = position;
                        $scope.center = new google.maps.LatLng(latitude, longitude);
                        $scope.mapSettings.zoom = 12;

                        $timeout(function () {
                            $scope.orderByDistance('closest');
                            $scope.$apply();
                        }, 1000);

                        $scope.currentLocationMarker = [{
                            "name": "Current location",
                            "location": {
                                "lat": latitude,
                                "lng": longitude
                            }
                        }];
                    }, function () {
                        alert.add('Erro ao adquirir geolocalização do usuário.');
                    });
                };

                $scope.findMe();
            }]);
}());
