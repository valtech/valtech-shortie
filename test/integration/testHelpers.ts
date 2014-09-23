import authMiddleware = require('../../src/auth/middleware');
import express = require('express');
import mongodb = require('mongodb');
import app = require('../../src/app');

var mockUser = {
  username: 'Someone',
  name: 'Some One',
  email: 'someone@example.com'
};

export function mockAuthentication() {
  authMiddleware.requireAuthCookieOrRedirect = function (req, res, next) {
    req.authSession.profile = mockUser;
    next();
  };
  authMiddleware.requireAuthOrDeny = function (req, res, next) {
    req.authSession.profile = mockUser;
    next();
  };
}

export var mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/valtech-shortie_test?w=1';

export function setupMongo(callback) {
  // Setup test mongodb connection
  mongodb.MongoClient.connect(mongoUrl, (err: Error, db: mongodb.Db) => {
    if (err) return callback(err);
    callback(null, db);
  });
}

export function createApp(callback) {
    var appOpts = { dbType: 'mongodb', mongoUrl: mongoUrl };
    app.create(appOpts, function (err, app_) {
      callback(err, app_);
  });
}
