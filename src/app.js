var express = require('express'),
    http = require('http'),
    path = require('path'),
    sessions = require('client-sessions');

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
app.use(sessions({
  cookieName: 'authSession',
  secret: 'TODO: create some better secret',
  duration: 60 * 60 * 1000, // 1h
  activeDuration: 5 * 60 * 1000, // 5m 'sliding expiration'
  cookie: {
    secure: false // TODO: Set to true in stage/prod when we have certs
  }
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', staticRoutes.index);

app.get('/login', authRoutes.login);
app.get('/login/authenticated', authRoutes.authenticated);
app.get('/logout', authRoutes.logout);
app.get('/me', authRoutes.viewSession);

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
