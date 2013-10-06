/*jslint node: true */

module.exports = function (adapter) {
    'use strict';

    var collection = adapter.get().collection('users');

    exports.get = function (id, callback) {
        collection.findOne({id: id}, callback);
    };

    exports.save = function (id, data) {
        collection.update({id: id}, data, {upsert: true}, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };

    return exports;
};
