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

var MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.log('Using local mongodb instance');
  MONGO_URL = 'mongodb://127.0.0.1:27017/valtech_shorties?w=1';
}

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.logger({
  stream: {
    write: function(message, encoding){
      log.info(message);
    }
  }
}));
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

app.use(app.router);
app.use(errorMiddleware.handleError);

var shortiesRepo;

export function setup(options, callback?) {
  dbFactory.create(options.dbType, { mongoUrl: MONGO_URL }, function(err, db) {
    if (err) return callback(err);
    shortiesRepo = new shortiesData.ShortieRepository(db);
    setupRoutes();
    if (callback) callback();
  });
}

function setupRoutes() {
  staticRoutes.setup(app);
  authRoutes.setup(app);
  shortieRoutes.setup(app, { shortiesRepo: shortiesRepo });
  errorRoutes.setup(app);
}

export var App = app;
