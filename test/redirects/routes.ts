/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

import request = require('supertest');
import express = require('express');
import app = require('../../src/app');
var shortieApp: express.Express = app.App;

describe('app', function () {
  describe('GET /:slug', function () {
    it('should do redirect if shortie exists', function (done) {
      request(shortieApp)
        .get('/cats')
        .expect(302, done);
    });
  });
});
