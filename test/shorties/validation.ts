/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mocha/mocha.d.ts" />

import _ = require('underscore');
var chai = require('chai');
var expect = chai.expect;

import validation = require('../../src/shorties/validation');

describe('shorties/validation', function () {
  describe('isInvalidUrl', function() {
    _.each([null, undefined, 0, ''], function(url) {
      it('should treat "' + url + '" as invalid', function() {
        expect(validation.isInvalidUrl(url)).to.be.true;
      })
    });

    _.each(['https://www.google.com', 'http://localhost:8000/asdf'], function(url) {
      it('should treat "' + url + '" as valid', function() {
        expect(validation.isInvalidUrl(url)).to.be.false;
      })
    });
  });

  describe('isInvalidSlug', function() {
    _.each([null, undefined, 0, '', '/', 'a/b', '#', 'a#b', '?', 'a?b', 'https://www.google.com'], function(url) {
      it('should treat "' + url + '" as invalid', function() {
        expect(validation.isInvalidSlug(url)).to.be.true;
      })
    });

    _.each(['a', 'adam', 'this-is-a-somewhat-LONG-slug', '_'], function(url) {
      it('should treat "' + url + '" as valid', function() {
        expect(validation.isInvalidSlug(url)).to.be.false;
      })
    });
  });

  describe('isBlacklistedSlug', function() {
    _.each(['login', 'logout', 'me', 'admin', 'api', 'public'], function(url) {
      it('should treat "' + url + '" as blacklisted', function() {
        expect(validation.isBlacklistedSlug(url)).to.be.true;
      })
    });

    _.each(['other', 'slug', '_'], function(url) {
      it('should treat "' + url + '" as ok', function() {
        expect(validation.isBlacklistedSlug(url)).to.be.false;
      })
    });
  });
});
