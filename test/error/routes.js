var request = require('supertest');

var _ = require('underscore');
var app = require('../../src/app');

var shortieApp = app.App;

describe('404 error', function () {
    before(function (done) {
        app.setup({ dbType: 'nedb' }, done);
    });

    _.each(['GET', 'POST'], function (verb) {
        describe(verb + ' /non-existing-resource', function () {
            it('should return html for requests that accept html', function (done) {
                request(shortieApp)[verb.toLowerCase()]('/non-existing-resource').set('Accept', 'text/html').expect('Content-Type', /text\/html/).expect(/not found/).expect(404, done);
            });
            it('should return json for requests that accept json', function (done) {
                request(shortieApp)[verb.toLowerCase()]('/non-existing-resource').set('Accept', 'appliction/json').expect('Content-Type', /application\/json/).expect({ error: 'not found' }).expect(404, done);
            });
        });
    });
});
