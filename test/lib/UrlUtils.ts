/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />

import utils = require('../../src/lib/UrlUtils');

import _ = require('underscore');
import chai = require('chai');

var assert = chai.assert;

describe('UrlUtils', ()=> {
  describe('parseAndClean()', ()=> {
    describe('if scheme is missing', () => {
      it('should set http as scheme', () => {
        var url = "google.com";
        
        var result = utils.parseAndClean(url);

        assert(result.indexOf('http://') === 0);
      });
    });
    describe('if scheme is present', () => {
      it('should preserve scheme', () => {
        var url = 'https://google.com';

        var result = utils.parseAndClean(url);

        assert(result.indexOf('https://') === 0);
      });
    });
    describe('if path is missing', () => {
      it('should append root path', () => {
        var url = "http://google.com";
        
        var result = utils.parseAndClean(url);

        assert.equal(result, 'http://google.com/');
      });
    });
    describe('if path is present', () => {
      it('should preserve path', () => {
        var url = "http://google.com/search";
        
        var result = utils.parseAndClean(url);

        assert.equal(result, 'http://google.com/search');
      });
    });
  });
});