/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

var mongoUrl = process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/valtech_shorties_test?w=1';

var request = require('supertest');
var assert = require('chai').assert;

import express = require('express');
import mongodb = require('mongodb');
import app = require('../../src/app');

var shortieApp: express.Express = app.App;
var db, shortiesCollection;

describe('api', function() {
  before(function(done) {
    // Setup test mongodb connection
    mongodb.MongoClient.connect(mongoUrl, (err, _db) => {
      if (err) return done(err);
      db = _db;
      shortiesCollection = db.collection('shorties');

      // Setup app
      app.setup({dbType: 'mongodb'}, done);
    });
  });

  beforeEach(function(done) {
    // Remove all shorties
    shortiesCollection.remove({a:1}, {w:1}, done);
  });

  after(function(done) {
    db.close(true, done);
  });

  it('GET /:slug should return 404 if shortie cannot be found', function(done) {
    request(shortieApp)
      .get('/catch-me-if-you-can')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('POST / should insert a shortie that can be GET', function(done) {
    var url = 'http://www.imdb.com/title/tt0118276/'
    request(shortieApp)
      .post('/')
      .send({url: url})
      .set('Accept', 'application/json')
      .expect(201)
      .end(onCreated);

    function onCreated(err, res) {
      if (err) return done(err);
      var generatedSlug = res.body.slug;
      assert.isString(generatedSlug);
      assert.isTrue(generatedSlug.length > 4);
      request(shortieApp)
        .get('/' + generatedSlug)
        .expect('Location', url)
        .expect(302, done);
    };
  });
});
