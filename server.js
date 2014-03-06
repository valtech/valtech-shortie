var http = require('http');
var app = require('./src/app');
var logentries = require('node-logentries');

var log = logentries.logger({
    token: '9bb3dd10-4bfe-4fdb-b7ec-83c3b1fc26fc'
});

http.createServer(app.App).listen(app.App.get('port'), function () {
    log.log('Express server listening on port ' + app.App.get('port'));
});
