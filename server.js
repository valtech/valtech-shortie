var http = require('http');
var app = require('./src/app');

http.createServer(app.App).listen(app.App.get('port'), function () {
    console.log('Express server listening on port ' + app.App.get('port'));
});
