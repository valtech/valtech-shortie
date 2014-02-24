var slugGenerator = require('../../src/lib/slugGenerator');
var assert = require('chai').assert;
var _ = require('underscore');

describe('slugGenerator', function() {
  describe('generated slug', function() {
    it('should contain 5 consonants', function() {
      var slug = slugGenerator();
      assert.match(slug, /[bcdfghjklmnpqrstvwxz]{5}/);
    });

    it('should appear to be random', function() {
      var n = 20;
      var slugs = [];
      while (n--) {
        slugs.push(slugGenerator());
      }
      assert.equal(_.uniq(slugs).length, slugs.length);
    });
  });
});