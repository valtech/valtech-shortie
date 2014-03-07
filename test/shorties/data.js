/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
var _ = require('underscore');
var DbFactory = require('../../src/lib/DbFactory');
var data = require('../../src/shorties/data');
var assert = require('chai').assert;

describe('ShortieRepository', function () {
    var repo, db;

    before(function (done) {
        DbFactory.create('mongodb', {}, function (err, db_) {
            db = db_;
            done();
        });
    });

    beforeEach(function (done) {
        repo = new data.ShortieRepository(db, { pageSize: 1 });
        done();
    });

    afterEach(function (done) {
        db.remove({}, function (err) {
            if (err)
                throw err;
            done();
        });
    });

    describe('addShortie()', function () {
        it('should add a new Shortie', function (done) {
            var shortie = {
                url: 'http://icanhazcheezburger.com/',
                slug: 'cats'
            };
            repo.addShortie(shortie, function () {
                db.findOne({ slug: 'cats' }, function (err, doc) {
                    assert.isNull(err, err);
                    assert.isNotNull(doc);
                    assert.equal(doc.slug, 'cats');
                    done();
                });
            });
        });
        it('should fail when adding a duplicate Shortie', function (done) {
            var shortie = {
                url: 'http://icanhazcheezburger.com/',
                slug: 'cats'
            };
            repo.addShortie(shortie, function () {
                repo.addShortie(shortie, function (err) {
                    assert.isNotNull(err, err);
                    done();
                });
            });
        });
    });

    describe('getShortieBySlug()', function () {
        beforeEach(function (done) {
            db.insert({ url: 'http://icanhazcheezburger.com/', slug: 'cats' }, done);
        });
        it('should return existing Shortie', function (done) {
            repo.getShortieBySlug('cats', function (err, doc) {
                assert.isNull(err);
                assert.isNotNull(doc);
                assert.equal(doc.slug, 'cats');
                assert.equal(doc.url, 'http://icanhazcheezburger.com/');
                done();
            });
        });
        it('should return null for non-existing Shortie', function (done) {
            repo.getShortieBySlug('dogs', function (err, doc) {
                assert.isNull(doc);
                done();
            });
        });
    });

    describe('getShortiesByUrl()', function () {
        before(function (done) {
            db.insert([
                { url: 'http://icanhazcheezburger.com/', slug: 'cats' },
                { url: 'http://icanhazcheezburger.com/', slug: 'moar_cats' }
            ], done);
        });
        it('should return all matching Shorties', function (done) {
            repo.getShortiesByUrl('http://icanhazcheezburger.com/', function (err, docs) {
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
        it('should return empty array if no Shorties found', function (done) {
            repo.getShortiesByUrl('http://ihasahotdog.com/', function (err, docs) {
                assert.isNotNull(docs);
                assert.equal(docs.length, 0);
                done();
            });
        });
    });

    describe("getAllShorties()", function () {
        beforeEach(function (done) {
            db.insert([
                { url: 'http://icanhazcheezburger.com/', slug: 'cats' },
                { url: 'http://icanhazcheezburger.com/', slug: 'moar_cats' }
            ], done);
        });

        it('should return all shorties if not invoked with any arguments', function (done) {
            repo.getAllShorties(function (err, docs) {
                assert.isNull(err);
                assert.isNotNull(docs);
                assert.equal(docs.length, 2);
                done();
            });
        });

        it("should return first page if specified", function (done) {
            repo.getAllShorties(function (err, docs) {
                assert.isNull(err);
                assert.equal(docs.length, 1);
                assert.equal(docs[0].slug, 'cats');
                done();
            }, { page: 0, sort: { slug: 1 } });
        });

        it("should return second page if specified", function (done) {
            repo.getAllShorties(function (err, docs) {
                assert.isNull(err);
                assert.equal(docs.length, 1);
                assert.equal(docs[0].slug, 'moar_cats');
                done();
            }, { page: 1, sort: { 'slug': 1 } });
        });
    });
});
