/// <reference path="../../types/mocha.d.ts" />
var DbFactory = require('../../src/lib/DbFactory');
var data = require('../../src/redirects/data');
var assert = require('chai').assert;

describe('RedirectRepository', function () {
    var repo, db;
    beforeEach(function (done) {
        DbFactory.create('nedb', {}, function (err, db_) {
            db = db_;
            repo = new data.RedirectRepository(db_);
            done();
        });
    });

    it('should be able to add a Redirect', function (done) {
        var redirect = {
            url: 'http://icanhazcheezburger.com/',
            slug: 'cats'
        };
        repo.addRedirect(redirect);
        db.findOne({ slug: 'cats' }, function (err, doc) {
            assert.isNull(err, err);
            assert.isNotNull(doc);
            assert.equal(doc.slug, 'cats');
            done();
        });
    });
    it('should fail if Redirect already exists', function (done) {
        var redirect = {
            url: 'http://icanhazcheezburger.com/',
            slug: 'cats'
        };
        repo.addRedirect(redirect);
        repo.addRedirect(redirect, function (err, doc) {
            assert.isNull(err, err);
            assert.isNotNull(doc);
            assert.equal(doc.slug, 'cats');
            done();
        });
    });
});
