/// <reference path="../types/node/node.d.ts" />
/// <reference path="../types/express/express.d.ts" />

import express = require('express');
var sessions = require('client-sessions');
var path = require('path');

import redirectRoutes = require('./redirects/routes');
var authRoutes = require('./auth/routes');
var staticRoutes = require('./routes/static');
var errorRoutes = require('./routes/error');

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
    duration: 60 * 60 * 1000, // 1h
    activeDuration: 5 * 60 * 1000, // 5m 'sliding expiration'
    cookie: {
      secure: false // TODO: Set to true in stage/prod when we have certs
    }
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

// static routes
app.get('/', staticRoutes.index);
app.get('/admin', staticRoutes.admin);

// auth routes
app.get('/login', authRoutes.login);
app.get('/login/authenticated', authRoutes.authenticated);
app.get('/logout', authRoutes.logout);
app.get('/me', authRoutes.viewSession);

// redirect routes
app.get('/:slug', redirectRoutes.getHandler);
app.post('/', redirectRoutes.postHandler);
app.put('/:slug', redirectRoutes.putHandler);
app.del('/:slug', redirectRoutes.deleteHandler);

// error routes
app.all('*', errorRoutes.handleNotFound);
app.use(errorRoutes.handleError);

export var App = app;