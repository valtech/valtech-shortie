var request = require('supertest');

var app = require('../../src/app');

var shortieApp = app.App;

describe('static routes', function () {
    describe('GET / with Accept=text/html', function () {
        it('should return html', function (done) {
            request(shortieApp).get('/').expect('Content-Type', /text\/html/).expect(200, done);
        });
    });
});
