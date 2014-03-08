var request = require('supertest');

var app = require('../../src/app');
var shortieApp = app.App;

describe('shorties/routes', function () {
    before(function (done) {
        app.setup({ dbType: 'nedb' }, done);
    });

    describe('GET /:slug', function () {
        it('should redirect if shortie exists', function (done) {
            request(shortieApp).get('/cats').expect(302, done);
        });
        it('should return 404 if shortie does not exist', function (done) {
            request(shortieApp).get('/dogs').expect(404, done);
        });
    });
});
