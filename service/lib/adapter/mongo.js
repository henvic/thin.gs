/*jslint node: true */

module.exports = function (settings, mongoDb) {
    'use strict';

    var MongoClient = mongoDb.MongoClient,
        Server = mongoDb.Server,
        mongoClient,
        db;

    mongoClient = new MongoClient(new Server(settings.host, settings.port, {
        auto_reconnect: true
    }), settings.options);

    mongoClient.open(function (err, mongoClient) {
        db = mongoClient.db(settings.db);
    });

    exports.get = function () {
        return db;
    };

    return exports;
};
