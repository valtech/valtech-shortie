/// <reference path="../types/node/node.d.ts" />

import http = require('http');
import app = require('./app');

http.createServer(app.App).listen(app.App.get('port'), function () {
  console.log('Express server listening on port ' + app.App.get('port'));
});

