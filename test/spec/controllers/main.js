/*jslint node: true, browser: true */
/*global angular, describe, beforeEach, inject, it, expect */

describe('Controller: MainCtrl', function () {
    'use strict';

    // load the controller's module
    beforeEach(module('thin.gsApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
