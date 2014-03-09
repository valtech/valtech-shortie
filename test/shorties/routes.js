var request = require('supertest');

var app = require('../../src/app');
var shortieApp = app.App;

describe('shorties/routes', function () {
    before(function (done) {
        app.setup({ dbType: 'nedb' }, done);
    });
    describe('GET / with Accept=application/json', function () {
        it('should return json', function (done) {
            request(shortieApp).get('/').set('Accept', 'application/json').expect('Content-Type', /application\/json/).expect(200, done);
        });
    });
    describe('GET /:slug', function () {
        it('should return 404 if shortie does not exist', function (done) {
            request(shortieApp).get('/dogs').expect(404, done);
        });
    });
});
