/*jslint node: true */

module.exports = function (app, users, history, pub, util) {
    'use strict';

    //list of routes that are loaded on the client-side
    //this exists here to avoid 404 HTTP Statuses being sent
    var appRoutes = ['/tos'];

    app.get('/api/me', function (req, res, next) {
        if (!req.user) {
            res.status(204).send();
            return;
        }

        users.get(req.user, function (err, data) {
            if (err) {
                next(new Error('Failed to load user'));
                return;
            }

            res.json(data);
        });
    });

    app.post('/api/me', function (req, res, next) {
        var errors,
            data;

        if (!req.user) {
            res.status(404).send();
            return;
        }

        req.assert('notifications', 'Invalid notifications value').isIn([0, 1]);
        req.assert('blood.type').isBloodType(true);
        req.assert('blood.rh').isBloodRh(true);

        errors = req.validationErrors();

        if (errors) {
            res.json(400, {errors: errors});
            return;
        }

        data = {
            notifications: req.param('notifications'),
            blood: {
                type: req.param('blood').type,
                rh: req.param('blood').rh
            }
        };

        users.update(req.user, data, function (err) {
            if (err) {
                next(new Error('Failed to save user preferences'));
                return;
            }

            res.status(202).send();
        });
    });

    app.get('/api/history', function (req, res, next) {
        if (!req.user) {
            res.status(404).send();
            return;
        }

        history.getFromUser(req.user, function (err, data) {
            if (err) {
                next(new Error('Failed to load history'));
                return;
            }

            res.json(data);
        });
    });

    app.post('/api/history', function (req, res, next) {
        var errors;

        if (!req.user) {
            res.status(403).send();
        }

        req.assert('date').isDate8601();
        req.assert('place').len(1, 60);

        errors = req.validationErrors();

        if (errors) {
            res.json(400, {errors: errors});
            return;
        }

        history.insert({
            date: req.param('date'),
            place: req.param('place'),
            uid: req.user
        }, function (err, result) {
            if (err) {
                next(new Error('Failed to create history register'));
                return;
            }

            res.json(result);
        });
    });

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

    appRoutes.forEach(function (route) {
        app.all(route, function (req, res) {
            res.sendfile(pub + '/index.html');
        });
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

