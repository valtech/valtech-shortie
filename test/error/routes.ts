/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

import request = require('supertest');
import express = require('express');
import _ = require('underscore');
import app = require('../../src/app');
import shortieRoutes = require('../../src/shorties/routes');

describe('404 error', function () {
  var shortieApp;

  before(function (done) {
    this.timeout(5000);
    app.create({dbType:'nedb'}, function (err, app_) {
      shortieApp = app_;
      shortieApp.all('/force-error', function (req, res, next) {
        console.log('forcing error...');
        next();
      });
      done();
    });
  });

  _.each(['GET', 'POST'], function (verb) {
    describe(verb + ' /non-existing-resource', function () {
      it('should return html for requests that accept html', function (done) {
        this.timeout(5000);
        request(shortieApp)
        [verb.toLowerCase()]('/non-existing-resource')
          .set('Accept', 'text/html')
          .expect('Content-Type', /text\/html/)
          .expect(/not found/)
          .expect(404, done);
      });

      it('should return json for requests that accept json', function (done) {
        this.timeout(5000);
        request(shortieApp)
        [verb.toLowerCase()]('/non-existing-resource')
          .set('Accept', 'appliction/json')
          .expect('Content-Type', /application\/json/)
          .expect({ error: 'not found' })
          .expect(404, done);
      });
    });
  });
});
