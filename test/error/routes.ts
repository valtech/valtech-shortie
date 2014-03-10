/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

import request = require('supertest');
import express = require('express');
import _ = require('underscore');
import app = require('../../src/app');

var shortieApp: express.Express = app.App;

describe('404 error', function() {
  before(function(done) {
    shortieApp.all('/force-error', function(req, res, next) {
      next('forcing error');
    });
    app.setup({dbType: 'nedb'}, done);
  });

  _.each(['GET', 'POST'], function (verb) {
    describe(verb + ' /non-existing-resource', function () {
      it('should return html for requests that accept html', function (done) {
        request(shortieApp)
        [verb.toLowerCase()]('/non-existing-resource')
          .set('Accept', 'text/html')
          .expect('Content-Type', /text\/html/)
          .expect(/not found/)
          .expect(404, done);
      });

      it('should return json for requests that accept json', function (done) {
        request(shortieApp)
        [verb.toLowerCase()]('/non-existing-resource')
          .set('Accept', 'appliction/json')
          .expect('Content-Type', /application\/json/)
          .expect({ error: 'not found' })
          .expect(404, done);
      });
    });

    describe(verb + ' /force-error', function () {
      it('should return html for requests that accept html', function (done) {
        request(shortieApp)
        [verb.toLowerCase()]('/force-error')
          .set('Accept', 'text/html')
          .expect('Content-Type', /text\/html/)
          .expect(/internal server error/)
          .expect(500, done);
      });

      it('should return json for requests that accept json', function (done) {
        request(shortieApp)
        [verb.toLowerCase()]('/force-error')
          .set('Accept', 'appliction/json')
          .expect('Content-Type', /application\/json/)
          .expect({ error: 'internal server error' })
          .expect(500, done);
      });
    });
  });
});
