#!/usr/bin/env node

/*jslint node: true, unparam: true */

module.exports = function () {
    'use strict';

    var adapter,
        app,
        config,
        customExpressValidators = require('./lib/custom-express-validators'),
        express = require('express'),
        expressValidator = require('express-validator'),
        path = require('path'),
        pub = path.resolve('../app'),
        http = require('http'),
        everyauth = require('everyauth'),
        moment = require('moment'),
        mongoDb = require('mongodb'),
        mongo = require('./lib/adapter/mongo'),
        commonRoutes = require('./lib/routes/common'),
        users;

    try {
        config = require('./config.dist');
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }

        config = require('./config');
    }

    customExpressValidators(expressValidator, moment);

    adapter = mongo(config.adapter.mongo, mongoDb);

    users = require('./lib/users')(adapter);

    app = express();

    everyauth.everymodule.findUserById(function (id, callback) {
        callback(null, id);
    });

    everyauth.facebook
        .appId(config.facebook.key)
        .appSecret(config.facebook.secret)
        .scope(['user_birthday'])
        .handleAuthCallbackError(function (req, res) {
            res.redirect('/tos');

        })
        .findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
            var data = {
                id: fbUserMetadata.id.toString(),
                facebook: fbUserMetadata
            };

            users.save(data.id, data);

            return fbUserMetadata;
        })
        .redirectPath('/');

    if (config.reverseProxy) {
        app.enable('trust proxy');
    }

    app.use(express.cookieParser('foo'))
        .use(express.session())
        .use(express.bodyParser())
        .use(expressValidator())
        .use(express.csrf())
        .use(function (req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
        })
        .use(everyauth.middleware())
        .use(express.static(pub));

    commonRoutes(app, users, pub);

    http.createServer(app).listen(config.port);
};

module.exports();
