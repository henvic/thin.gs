/*jslint node: true */

module.exports = function (adapter) {
    'use strict';

    var getCollection;

    getCollection = function () {
        return adapter.get().collection('history');
    };

    exports.getFromUser = function (uid, callback) {
        var cursor = getCollection().find({uid: uid});

        cursor.sort({'date': -1}).toArray(function (err, data) {
            var result = [];

            if (Array.isArray(data)) {
                data.forEach(function (datum) {
                    result.push({
                        id: datum._id,
                        uid: datum.uid,
                        date: datum.date,
                        place: datum.place
                    });
                });
            }

            callback(err, result);
        });
    };

    exports.get = function (id, callback) {
        getCollection().findOne({_id: adapter.getObjectID(id)}, function (err, data) {
            var result;

            if (data) {
                result = {
                    id: data._id,
                    uid: data.uid,
                    date: data.date,
                    place: data.place
                };
            }

            callback(err, result);
        });
    };

    exports.insert = function (data, callback) {
        var params = {};

        params.date = data.date;
        params.place = data.place;
        params.uid = data.uid;

        getCollection().insert(params, function (err, result) {
            var feedback;

            if (result && result[0] && result[0]._id) {
                feedback = result[0];
                feedback.id = feedback._id;
                delete feedback._id;
            }

            callback(err, feedback);
        });
    };

    exports.remove = function (id, callback) {
        getCollection().remove({_id: adapter.getObjectID(id)}, callback);
    };

    return exports;
};
