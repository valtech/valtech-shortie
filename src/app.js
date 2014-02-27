var express = require('express'),
    http = require('http'),
    path = require('path');

var staticRoutes = require('./routes/static'),
    redirectRoutes = require('./routes/redirect'),
    authRoutes = require('./routes/auth'),
    errorRoutes = require('./routes/error');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('LKSDJFLKSHf-very-secret'));
app.use(express.cookieSession()); // TODO: Set secret and age and stuff
// Should we use cookie sessions?
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', staticRoutes.index);

app.get('/login', authRoutes.login);
app.get('/logout', authRoutes.logout);
app.get('/authenticated', authRoutes.authenticated);

app.get('/admin', staticRoutes.admin);

app.get('/:slug', redirectRoutes.get);
app.post('/', redirectRoutes.post);
app.put('/:slug', redirectRoutes.put);
app.delete('/:slug', redirectRoutes.delete);

app.all('*', errorRoutes.handleNotFound);
app.use(errorRoutes.handleError);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

exports.app = app;
