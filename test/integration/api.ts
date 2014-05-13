/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

var request = require('supertest');
var assert = require('chai').assert;

import util = require('util');
import express = require('express');
import mongodb = require('mongodb');
import app = require('../../src/app');
import authMiddleware = require('../../src/auth/middleware');

var shortieApp;
var db: mongodb.Db;
var shortiesCollection: mongodb.Collection;

function createApp(done) {
  // Setup test mongodb connection
  var mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/valtech_shorties_test?w=1';
  mongodb.MongoClient.connect(mongoUrl, (err: Error, _db: mongodb.Db) => {
    if (err) return done(err);
    db = _db;
    shortiesCollection = db.collection('shorties');

    var appOpts = { dbType: 'mongodb', mongoUrl: mongoUrl };
    app.create(appOpts, function (err, app_) {
      shortieApp = app_;
      done();
    });
  });
}



describe('api (unauthenticated)', function () {
  before(function (done) {
    this.timeout(5000);
    createApp(function () {
      shortiesCollection.insert({ slug: 'short-shorts' }, function () {
        done();
      });
    });
  });

  afterEach(function (done) {
    // Remove all shorties
    shortiesCollection.remove({}, { w: 1 }, done);
  });

  after(function (done) {
    if (!db) return done();
    db.close(true, done);
  });

  it('GET /api/shorties/ should return 401', function (done) {
    request(shortieApp)
      .get('/api/shorties/')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('POST /api/shorties/ should return 401', function (done) {
    request(shortieApp)
      .post('/api/shorties/')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('PUT /api/shorties/:slug should return 401', function (done) {
    request(shortieApp)
      .put('/api/shorties/short-shorts')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('DELETE /api/shorties/:slug should return 401', function (done) {
    request(shortieApp)
      .del('/api/shorties/short-shorts')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

});

describe('api (authenticated)', function () {
  before(function (done) {
    this.timeout(5000);
    createApp(done);
    var user = {
      username: 'Someone',
      name: 'Some One',
      email: 'someone@example.com'
    };
    authMiddleware.requireAuthCookieOrRedirect = function (req, res, next) { 
      req.authSession.profile = user;
      next(); 
    };
    authMiddleware.requireAuthOrDeny = function (req, res, next) { 
      req.authSession.profile = user;
      next(); 
    };
  });

  afterEach(function (done) {
    // Remove all shorties
    shortiesCollection.remove({}, { w: 1 }, done);
  });

  after(function (done) {
    if (!db) return done();
    db.close(true, done);
  });

  it('GET /api/shorties/ should return 200', function (done) {
    request(shortieApp)
      .get('/api/shorties/')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('GET /api/shorties/:slug should return 404 if shortie cannot be found', function (done) {
    request(shortieApp)
      .get('/api/shorties/catch-me-if-you-can')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('DELETE /api/shorties/:slug should return 404 if shortie cannot be found', function (done) {
    request(shortieApp)
      .del('/api/shorties/catch-me-if-you-can')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('POST /api/shorties/ should insert a shortie that can be GET', function (done) {
    var url = 'http://www.imdb.com/title/tt0118276/'
    request(shortieApp)
      .post('/api/shorties/')
      .send({ url: url })
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

  it('POST /api/shorties/ should return existing shortie if URL has already been shortened', function (done) {
    var url = 'http://www.imdb.com/title/tt0118276/';
    request(shortieApp)
      .post('/api/shorties/')
      .send({ url: url })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        request(shortieApp)
          .post('/api/shorties/')
          .send({ url: url })
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err2, res2) {
            if(err2) return done(err2);
            assert.equal(res2.body.slug, res.body.slug);
            done();
          });
      });
  });

  it('PUT /api/shorties/:slug should insert a shortie', function (done) {
    var url = 'http://www.imdb.com/title/tt0118276/'
    request(shortieApp)
      .put('/api/shorties/buffy')
      .send({ slug: 'buffy', url: url })
      .set('Accept', 'application/json')
      .expect(201)
      .end(onCreated);

    function onCreated(err, res) {
      if (err) return done(err);
      var slug = res.body.slug;
      assert.equal(slug, 'buffy');
      request(shortieApp)
        .get('/' + slug)
        .expect('Location', url)
        .expect(302, done);
    };
  });

  describe('with data', function () {
    var url1 = 'http://1.example.com';
    var url2 = 'http://2.example.com';
    var url3 = 'http://3.example.com';
    var slug1, slug2, slug3;

    beforeEach(function (done) {
      // Insert 3 shorties
      request(shortieApp)
        .post('/api/shorties/')
        .send({ url: url1 })
        .set('Accept', 'application/json')
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          slug1 = res.body.slug;

          request(shortieApp)
            .post('/api/shorties/')
            .send({ url: url2 })
            .set('Accept', 'application/json')
            .expect(201)
            .end(function (err, res) {
              if (err) return done(err);
              slug2 = res.body.slug;

              request(shortieApp)
                .post('/api/shorties/')
                .send({ url: url3 })
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                  if (err) return done(err);
                  slug3 = res.body.slug;
                  done();
                });
            });
        });
    });

    it('GET /api/shorties/ should return all shorties', function (done) {
      request(shortieApp)
        .get('/api/shorties/')
        .set('Accept', 'application/json')
        .expect(function (res) {
          var count = res.body.length;
          if (count != 3) return util.format('Response included %d shorties, expected %d', count, 3);
        })
        .expect(200, done);
    });

    it('PUT /api/shorties/:slug with new slug should update existing shortie', function (done) {
      var newSlug = 'qwerty-finch';
      request(shortieApp)
        .put('/api/shorties/' + slug1)
        .send({ slug: newSlug, url: url1 })
        .set('Accept', 'application/json')
        .expect(201)
        .expect(function (res) {
          if (res.body.slug != newSlug) return "Slug was not updated";
        })
        .end(function (err, res) {
          if (err) return done(err);

          request(shortieApp)
            .get('/api/shorties/')
            .set('Accept', 'application/json')
            .expect(function (res) {
              var count = res.body.length;
              if (count != 3) return util.format('Response included %d shorties, expected %d', count, 3);
            })
            .expect(200, done);
        });
    });

    it('PUT /api/shorties/:slug with new URL should update existing shortie', function (done) {
      var newUrl = 'http://www.imdb.com/title/tt0118276/'
      request(shortieApp)
        .put('/api/shorties/' + slug1)
        .send({ slug: slug1, url: newUrl })
        .set('Accept', 'application/json')
        .expect(201) // TODO: Return 200 when replacing?
        .expect(function (res) {
          if (res.body.url != newUrl) return "URL was not updated";
        })
        .end(function (err, res) {
          if (err) return done(err);

          request(shortieApp)
            .get('/api/shorties/')
            .set('Accept', 'application/json')
            .expect(function (res) {
              var count = res.body.length;
              if (count != 3) return util.format('Response included %d shorties, expected %d', count, 3);
            })
            .expect(200, done);
        });
    });

    it('DELETE /api/shorties/:slug should', function (done) {
      var resource = '/api/shorties/' + slug1;
      request(shortieApp)
        .del(resource)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          request(shortieApp)
            .get(resource)
            .set('Accept', 'application/json')
            .expect(404, done);
        });
    });
  });
});