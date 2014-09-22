/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

import qs = require('querystring');
import request = require('supertest');
import express = require('express');
import _ = require('underscore');
import app = require('../../src/app');

describe('auth', function () {
  var shortieApp;

  before(function (done) {
    this.timeout(5000);
    app.create({dbType:'nedb'}, function (err, app) {
      shortieApp = app;
      done();
    });
  });

  describe('validate redirect url', function() {
    it('should reject absolute urls', function(done) {
      request(shortieApp)
        .get('/login?redirect=http%3A%2F%2Fwww.google.com')
        .expect(400, done);
    });

    var unacceptableLocalRedirects = ['%2Fpossibly-malicious-shortie', '%2Fadminother'];
    _.each(unacceptableLocalRedirects, function(redirect) {
      it('should reject unknown relative url "'+redirect+'"', function(done) {
        request(shortieApp)
          .get('/login?redirect=' + redirect)
          .expect(400, done);
      });
    });

    var acceptableRedirects = ['/admin', '/admin/whatever?123'];
    _.each(acceptableRedirects, function(redirect) {
      it('should accept url "'+redirect+'"', function(done) {
        request(shortieApp)
          .get('/login?' + qs.stringify({ redirect: redirect }))
          .expect('Location', redirect)
          .expect(302, done);
      });
    });
  });
});
