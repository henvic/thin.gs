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
        var doc = {
            $set: {
                facebook: data.facebook
            },
            $setOnInsert: {
                id: id,
                notifications: "1",
                blood: {
                    type: '',
                    rh: ''
                }
            }
        };

        getCollection().update({id: id}, doc, {upsert: true}, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };

    exports.update = function (id, data, callback) {
        getCollection().update({id: id}, {$set: data}, {}, callback);
    };

    return exports;
};
