/// <reference path="../types/node/node.d.ts" />

import http = require('http');
var app = require('./app').app;

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

