﻿/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/supertest/supertest.d.ts" />
var request = require('supertest');

var app = require('../../src/app');
var shortieApp = app.App;

describe('redirects routes', function () {
    describe('GET /:slug', function () {
        it('should redirect if shortie exists', function (done) {
            request(shortieApp).get('/cats').expect(302, done);
        });
        it('should return 404 if shortie does not exist', function (done) {
            request(shortieApp).get('/dogs').expect(404, done);
        });
    });
});
