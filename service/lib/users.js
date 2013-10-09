/*jslint node: true */

module.exports = function (adapter) {
    'use strict';

    var getCollection;

    getCollection = function () {
        return adapter.get().collection('users');
    };

    exports.get = function (id, callback) {
        getCollection().findOne({id: id}, callback);
    };

    exports.save = function (id, data) {
        getCollection().update({id: id}, data, {upsert: true}, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };

    return exports;
};
