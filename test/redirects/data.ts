/// <reference path="../../.types/mocha/mocha.d.ts" />

import DbFactory = require('../../src/lib/DbFactory');
import data = require('../../src/redirects/data');
var assert = require('chai').assert;

describe('RedirectRepository', function() {
  var repo, db;
  beforeEach(function(done) {
    DbFactory.create('nedb', {}, function(err, db_) {
      db = db_;
      repo = new data.RedirectRepository(db_);
      done();
    });
  });
  describe('addRedirect()', function() {
    it('should add a new Redirect', function(done) {
      var redirect = {      
        url: 'http://icanhazcheezburger.com/',
        slug: 'cats'
      };
      repo.addRedirect(redirect);
      db.findOne({ slug: 'cats' }, function(err, doc) {
        assert.isNull(err, err);
        assert.isNotNull(doc);
        assert.equal(doc.slug, 'cats');
        done();
      });
    });
    it('should fail when adding a duplicate Redirect', function(done) {
      var redirect = {      
        url: 'http://icanhazcheezburger.com/',
        slug: 'cats'
      };
      repo.addRedirect(redirect);
      repo.addRedirect(redirect, function(err, doc) {
        assert.isNotNull(err, err);
        done();
      });
    });
  });
  describe('getRedirectBySlug()', function() {
    beforeEach(function(done) {
      db.insert({ url: 'http://icanhazcheezburger.com/', slug: 'cats' }, done);
    });
    it('should return existing Redirect', function(done) {
      repo.getRedirectBySlug('cats', function(err, doc) {
        assert.isNull(err);
        assert.isNotNull(doc);
        assert.equal(doc.slug, 'cats');
        assert.equal(doc.url, 'http://icanhazcheezburger.com/');
        done();
      });
    });
  });

});

