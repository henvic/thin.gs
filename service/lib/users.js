/*jslint node: true */

module.exports = function (adapter) {
    'use strict';

    exports.get = function (id, callback) {
        if (!adapter.get()) {
            console.error('Failed to load DB');
        }

        adapter.get().collection('users').findOne({id: id}, callback);
    };

    exports.save = function (id, data) {
        if (!adapter.get()) {
            console.error('Failed to load DB');
        }

        adapter.get().collection('users').update({id: id}, data, {upsert: true}, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };

    return exports;
};
