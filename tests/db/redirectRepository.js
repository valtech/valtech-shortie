var assert = require('chai').assert;
var dbFactory = require('../../src/lib/dbFactory');
var RedirectRepository = require('../../src/lib/redirectRepository');

describe('RedirectRepository', function() {
  var repo, db;
  beforeEach(function(done) {
    dbFactory('nedb', {}, function(err, db_) {
      db = db_;
      repo = new RedirectRepository(db_);
      done();
    });
  });
  
  it('should be able to add a Redirect', function(done) {
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
  it('should fail if Redirect already exists', function(done) {
    var redirect = {      
      url: 'http://icanhazcheezburger.com/',
      slug: 'cats'
    };
    repo.addRedirect(redirect);
    repo.addRedirect(redirect, function(err, doc) {
      assert.isNull(err, err);
      assert.isNotNull(doc);
      assert.equal(doc.slug, 'cats');
      done();
    });
  });
});

