/// <reference path="../.types/node.d.ts" />
var http = require('http');
var app = require('./app');

http.createServer(app.App).listen(app.App.get('port'), function () {
    console.log('Express server listening on port ' + app.App.get('port'));
});
