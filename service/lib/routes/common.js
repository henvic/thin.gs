/*jslint node: true */

module.exports = function (app, users, pub) {
    'use strict';

    app.get('/api/me', function (req, res, next) {
        if (req.method !== 'GET') {
            res.status(405).json({error: 405, message: '405 Method Not Allowed'});
            return;
        }

        if (req.user) {
            users.get(req.user, function (err, data) {
                if (err) {
                    next(new Error('Failed to load user'));
                    return;
                }

                res.json(data);
            });
            return;
        }

        res.json(204, req.user);
    });

    app.post('/logout', function (req, res) {
        req.logout();
        res.json({logout: true});
    });

    app.use(function (err, req, res, next) {
        if (err && err.status && err.toString) {
            res.send(err.status, err.toString());
            return;
        }

        res.status(500).json({error: 500, message: '500 Internal Server Error'});
    });

    app.all('/tos', function (req, res) {
        res.sendfile(pub + '/index.html');
    });

    app.use(function (req, res, next) {
        res.status(404);

        if (req.accepts('html')) {
            res.sendfile(pub + '/index.html');
            return;
        }

        res.json({error: 404, message: 'not found'});
    });
};

