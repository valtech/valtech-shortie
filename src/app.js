var express = require('express');
var sessions = require('client-sessions');
var path = require('path');

var shortieRoutes = require('./shorties/routes');
var authRoutes = require('./auth/routes');
var staticRoutes = require('./static/routes');
var errorRoutes = require('./error/routes');
var errorMiddleware = require('./error/middleware');

var dbFactory = require('./lib/DbFactory');
var shortiesData = require('./shorties/data');

var MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.log('Using local mongodb instance');
    MONGO_URL = 'mongodb://127.0.0.1:27017/valtech_shorties?w=1';
}

var app = express();

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
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
        secure: false
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV == 'development') {
    app.use(express.errorHandler());
}

app.use(app.router);
app.use(errorMiddleware.handleError);

var db, shortiesRepo;

function setup(options, callback) {
    dbFactory.create(options.dbType, { mongoUrl: MONGO_URL }, function (err, db) {
        if (err)
            return callback(err);
        db = db;
        shortiesRepo = new shortiesData.ShortieRepository(db);
        setupRoutes();
        if (callback)
            callback();
    });
}
exports.setup = setup;

function setupRoutes() {
    staticRoutes.setup(app);
    authRoutes.setup(app);
    shortieRoutes.setup(app, { shortiesRepo: shortiesRepo });
    errorRoutes.setup(app);
}

exports.App = app;
