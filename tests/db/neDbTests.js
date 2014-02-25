var assert = require('chai').assert;
var dbFactory = require('../../src/lib/dbFactory');

describe('NeDb handler', function() {
  var db;
  beforeEach(function(done) {
    dbFactory('nedb', {}, function(err, db_) {
      db = db_;
      done();
    });
  });
  it('should be able to insert document and find it', function(done) {
    db.insert({ foo: 'bar' }, function(err) {
      assert.isNull(err, err);
      db.findOne({ foo: 'bar' }, function(err, doc) {
        assert.isNull(err, err);
        assert.isNotNull(doc);
        assert.equal(doc.foo, 'bar');
        done();
      });
    });
  });
  it('should fail insert on unique violation', function(done) {
    db.ensureIndex({ fieldName: 'foo', unique: true });
    db.insert([{ foo: 'bar' }, { foo: 'bar' }], function(err) {
      assert.isNotNull(err);
      done();
    });
  });
});

