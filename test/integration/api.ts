/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

var mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.log('Using local mongodb instance');
  mongoUrl = process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/valtech_shorties_test?w=1';
}

var request = require('supertest');
var assert = require('chai').assert;

import util = require('util');
import express = require('express');
import mongodb = require('mongodb');
import app = require('../../src/app');

var shortieApp: express.Express = app.App;
var db: mongodb.Db;
var shortiesCollection: mongodb.Collection;

describe('api', function() {
  before(function(done) {
    // bob -> mongohq connection is slow...
    this.timeout(5000);

    // Setup test mongodb connection
    mongodb.MongoClient.connect(mongoUrl, (err: Error, _db: mongodb.Db) => {
      if (err) return done(err);
      db = _db;
      shortiesCollection = db.collection('shorties');

      // Setup app
      app.setup({dbType: 'mongodb'}, done);
    });
  });

  afterEach(function(done) {
    // Remove all shorties
    shortiesCollection.remove({}, { w: 1 }, done);
  });

  after(function(done) {
    if (!db) return done();
    db.close(true, done);
  });

  it('GET /:slug should return 404 if shortie cannot be found', function(done) {
    request(shortieApp)
      .get('/catch-me-if-you-can')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('DELETE /:slug should return 404 if shortie cannot be found', function(done) {
    request(shortieApp)
      .del('/catch-me-if-you-can')
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

  it('PUT /:slug should insert a shortie', function(done) {
    var url = 'http://www.imdb.com/title/tt0118276/'
    request(shortieApp)
      .put('/buffy')
      .send({slug: 'buffy', url: url})
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

  describe('with data', function() {
    var url1 = 'http://1.example.com';
    var url2 = 'http://2.example.com';
    var url3 = 'http://3.example.com';
    var slug1, slug2, slug3;

    beforeEach(function(done) {
      // Insert 3 shorties
      request(shortieApp)
        .post('/')
        .send({url: url1})
        .set('Accept', 'application/json')
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          slug1 = res.body.slug;

          request(shortieApp)
            .post('/')
            .send({url: url2})
            .set('Accept', 'application/json')
            .expect(201)
            .end(function(err, res) {
              if (err) return done(err);
              slug2 = res.body.slug;

              request(shortieApp)
                .post('/')
                .send({url: url3})
                .set('Accept', 'application/json')
                .expect(201)
                .end(function(err, res) {
                  if (err) return done(err);
                  slug3 = res.body.slug;
                  done();
                });
          });
      });
    });

    it('GET / should return all shorties', function(done) {
      request(shortieApp)
        .get('/')
        .set('Accept', 'application/json')
        .expect(function(res) {
          var count = res.body.length;
          if (count != 3) return util.format('Response included %d shorties, expected %d', count, 3);
        })
        .expect(200, done);
    });

    it('PUT /:slug should replace existing shortie', function(done) {
      var newSlug = 'qwerty-finch';
      var url = 'http://www.imdb.com/title/tt0118276/'
      request(shortieApp)
        .put('/' + slug1)
        .send({slug: newSlug, url: url})
        .set('Accept', 'application/json')
        .expect(201) // TODO: Return 200 when replacing?
        .expect(function(res) {
          if (res.body.slug != newSlug) return "Slug not replaced with new slug";
        })
        .end(function(err, res) {
          if (err) return done(err);

          request(shortieApp)
            .get('/')
            .set('Accept', 'application/json')
            .expect(function(res) {
              var count = res.body.length;
              if (count != 3) return util.format('Response included %d shorties, expected %d', count, 3);
            })
            .expect(200, done);
        });
    });

    it('DELETE /:slug should', function(done) {
      var resource = '/' + slug1;
      request(shortieApp)
        .del(resource)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          request(shortieApp)
            .get(resource)
            .set('Accept', 'application/json')
            .expect(404, done);
        });
    });
  });
});
