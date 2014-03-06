var _ = require('underscore');
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
    describe('addRedirect()', function () {
        it('should add a new Redirect', function (done) {
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
        it('should fail when adding a duplicate Redirect', function (done) {
            var redirect = {
                url: 'http://icanhazcheezburger.com/',
                slug: 'cats'
            };
            repo.addRedirect(redirect);
            repo.addRedirect(redirect, function (err, doc) {
                assert.isNotNull(err, err);
                done();
            });
        });
    });
    describe('getRedirectBySlug()', function () {
        beforeEach(function (done) {
            db.insert({ url: 'http://icanhazcheezburger.com/', slug: 'cats' }, done);
        });
        it('should return existing Redirect', function (done) {
            repo.getRedirectBySlug('cats', function (err, doc) {
                assert.isNull(err);
                assert.isNotNull(doc);
                assert.equal(doc.slug, 'cats');
                assert.equal(doc.url, 'http://icanhazcheezburger.com/');
                done();
            });
        });
        it('should return null for non-existing Redirect', function (done) {
            repo.getRedirectBySlug('dogs', function (err, doc) {
                assert.isNull(doc);
                done();
            });
        });
    });
    describe('getRedirectsByUrl()', function () {
        beforeEach(function (done) {
            db.insert([
                { url: 'http://icanhazcheezburger.com/', slug: 'cats' },
                { url: 'http://icanhazcheezburger.com/', slug: 'moar_cats' }
            ], done);
        });
        it('should return all matching Redirects', function (done) {
            repo.getRedirectsByUrl('http://icanhazcheezburger.com/', function (err, docs) {
                assert.isNull(err);
                assert.isNotNull(docs);
                assert.equal(docs.length, 2);
                docs = _.sortBy(docs, function (doc) {
                    return doc.slug;
                });
                assert.equal(docs[0].slug, 'cats');
                assert.equal(docs[1].slug, 'moar_cats');
                done();
            });
        });
        it('should return empty array if no Redirects found', function (done) {
            repo.getRedirectsByUrl('http://ihasahotdog.com/', function (err, docs) {
                assert.isNotNull(docs);
                assert.equal(docs.length, 0);
                done();
            });
        });
    });
});
