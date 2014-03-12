/// <reference path="./.types/node/node.d.ts" />

import http = require('http');
import app = require('./src/app');
var log = require('winston');

var environment = process.env.NODE_ENV || 'development';

if (environment == 'production') {
  require('newrelic');
  var logentries = require('node-logentries');
  logentries.logger({
    token: '9bb3dd10-4bfe-4fdb-b7ec-83c3b1fc26fc'
  }).winston(log, {
      level: 'silly',
      levels: {
        silly: 0,
        debug: 1,
        info: 2,
        error: 3,
        fatal: 4
      }
    });
} else {
}

log.info('Running in environment ' + environment);

var appOpts = {
  environment: environment,
  port: process.env.PORT || 3000,
  dbType: 'mongodb',
  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/valtech_shorties?w=1',
  sessionSecret: 'TODO: create some better secret',
  sessionDuration: 60 * 60 * 1000,
  sessionActiveDuration: 5 * 60 * 1000,
  sessionUseSecureCookie: false
};


app.create(appOpts, function (err, app) {
  http.createServer(app).listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
  });
});
