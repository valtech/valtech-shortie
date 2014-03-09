/// <reference path="./.types/node/node.d.ts" />

import http = require('http');
import app = require('./src/app');

var log = require('winston');

var mode = process.env.NODE_ENV || 'development';

if (mode == 'production') {
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

log.info('Running in mode ' + mode);

app.setup({dbType: 'mongodb'}, function(err) {
  if (err) {
    log.fatal(err);
  }
  http.createServer(app.App).listen(app.App.get('port'), function () {
    log.info('Express server listening on port ' + app.App.get('port'));
  });
});


