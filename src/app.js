/// <reference path="../types/node.d.ts" />
/// <reference path="../types/express.d.ts" />
var express = require('express');
var sessions = require('client-sessions');
var path = require('path');

var redirectRoutes = require('./redirects/routes');
var authRoutes = require('./auth/routes');
var staticRoutes = require('./static/routes');
var errorRoutes = require('./error/routes');
var errorMiddleware = require('./error/middleware');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(sessions({
        cookieName: 'authSession',
        secret: 'TODO: create some better secret',
        duration: 60 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        cookie: {
            secure: false
        }
    }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

staticRoutes.setup(app);
authRoutes.setup(app);
redirectRoutes.setup(app);
errorRoutes.setup(app);

app.use(errorMiddleware.handleError);

exports.App = app;
