/// <reference path="../.types/node/node.d.ts" />
/// <reference path="../.types/express/express.d.ts" />

import express = require('express');
var sessions = require('client-sessions');
var path = require('path');
var log = require('winston');

import shortieRoutes = require('./shorties/routes');
import authRoutes = require('./auth/routes');
import staticRoutes = require('./static/routes');
import errorRoutes = require('./error/routes');
import errorMiddleware = require('./error/middleware');

import dbFactory = require('./lib/DbFactory');
import shortiesData = require('./shorties/data');


export function setup(app, options, callback?) : void {
  dbFactory.create(options.dbType, { mongoUrl: options.mongoUrl }, function(err, db) {
    if (err) {
      callback(err);
      return;
    }
    var repo = new shortiesData.ShortieRepository(db);
    setupRoutes(app, repo);
    if (callback) callback();
  });
}

function setupRoutes(app, repo) {
  staticRoutes.setup(app);
  authRoutes.setup(app);
  shortieRoutes.setup(app, { shortiesRepo: repo });
  errorRoutes.setup(app);
}

export function create(options, callback: (err: any, app)=>void) {
  var app = express();

  app.set('port', options.port);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.logger({
    stream: {
      write: function (message, encoding) {
        log.info(message);
      }
    }
  }));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(sessions({
    cookieName: 'authSession',
    secret: options.sessionSecret || 'dummy secret',
    duration: options.sessionDuration,
    activeDuration: options.sessionActiveDuration,
    cookie: {
      secure: options.sessionsUseSecureCookie
    }
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  if (options.environment == 'development') {
    app.use(express.errorHandler());
  }
  app.use(function(req, res, next) {
    // No caching for the routes that follow
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });
  app.use(app.router);
  app.use(errorMiddleware.handleError);

  setup(app, options, (setupErr) => {
    callback(setupErr, app);
  });
}
