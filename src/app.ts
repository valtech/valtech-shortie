/// <reference path="../.types/node/node.d.ts" />
/// <reference path="../.types/express/express.d.ts" />

import express = require('express');
var sessions = require('client-sessions');
var path = require('path');

import redirectRoutes = require('./redirects/routes');
import authRoutes = require('./auth/routes');
import staticRoutes = require('./static/routes');
import errorRoutes = require('./error/routes');
import errorMiddleware = require('./error/middleware');

var app = express();

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
  duration: 60 * 60 * 1000, // 1h
  activeDuration: 5 * 60 * 1000, // 5m 'sliding expiration'
  cookie: {
    secure: false // TODO: Set to true in stage/prod when we have certs
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV == 'development') {
  app.use(express.errorHandler());
}

staticRoutes.setup(app);
authRoutes.setup(app);
redirectRoutes.setup(app);
errorRoutes.setup(app);

app.use(app.router);
app.use(errorMiddleware.handleError);

export var App = app;
