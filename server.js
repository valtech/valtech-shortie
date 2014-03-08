var mode = process.env.NODE_ENV || 'development';

var log;
if (mode == 'production') {
    require('newrelic');
    var logentries = require('node-logentries');
    log = logentries.logger({
        token: '9bb3dd10-4bfe-4fdb-b7ec-83c3b1fc26fc'
    });
}

var http = require('http');
var app = require('./src/app');

app.setup({ dbType: 'mongodb' }, function (err) {
    if (err)
        return console.log(err);
    http.createServer(app.App).listen(app.App.get('port'), function () {
        var msg = 'Express server listening in ' + mode + ' mode on port ' + app.App.get('port');
        console.log(msg);
        if (mode == 'production') {
            log.info(mode);
        }
    });
});
