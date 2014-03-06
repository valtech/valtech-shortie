var SlugGenerator = require('../../src/lib/SlugGenerator');
var _ = require('underscore');
var chai = require('chai');
var assert = chai.assert;

describe('SlugGenerator', function () {
    describe('generated slug', function () {
        it('should contain 5 consonants', function () {
            var slug = SlugGenerator.generate(5, 'bcdfghjklmnpqrstvwxz');
            assert.match(slug, /[bcdfghjklmnpqrstvwxz]{5}/);
        });

        it('should appear to be random', function () {
            var n = 20;
            var slugs = [];
            while (n--) {
                var slug = SlugGenerator.generate(5, 'bcdfghjklmnpqrstvwxz');
                slugs.push(slug);
            }
            assert.equal(_.uniq(slugs).length, slugs.length);
        });
    });
});
