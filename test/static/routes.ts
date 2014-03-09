/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />

import request = require('supertest');
import express = require('express');
import app = require('../../src/app');

var shortieApp: express.Express = app.App;

describe('static routes', function () {
  describe('GET / with Accept=text/html', function () {
    it('should return html', function (done) {
      request(shortieApp)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });
});