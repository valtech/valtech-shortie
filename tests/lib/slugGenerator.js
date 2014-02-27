var SlugGenerator = require('../../src/lib/SlugGenerator');
var assert = require('chai').assert;
var _ = require('underscore');

describe('SlugGenerator', function() {
  var slugGenerator;
  before(function() {
      console.log(SlugGenerator);
      slugGenerator = new SlugGenerator(5, 'bcdfghjklmnpqrstvwxz');
  });
  describe('generated slug', function() {
    it('should contain 5 consonants', function() {
      var slug = slugGenerator.generate();
      assert.match(slug, /[bcdfghjklmnpqrstvwxz]{5}/);
    });

    it('should appear to be random', function() {
      var n = 20;
      var slugs = [];
      while (n--) {
        slugs.push(slugGenerator.generate());
      }
      assert.equal(_.uniq(slugs).length, slugs.length);
    });
  });
});