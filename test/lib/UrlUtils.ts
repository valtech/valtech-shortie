/// <reference path="../../.types/mocha/mocha.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />

import utils = require('../../src/lib/UrlUtils');

import _ = require('underscore');
var chai = require('chai');
var assert = chai.assert;

describe('UrlUtils', ()=> {
  describe('parseAndClean()', ()=> {
    describe('adding http', ()=> {
      it('Should do nothing if url has http', () => {
        /* Setup */
        var url = "http://www.google.se";
        
        /* Test */
        var result = utils.parseAndClean(url);

        assert.equal(result, url);
      });

      it("Should do nothing if url starts with https", ()=> {
        /* Setup */
        var url = "https://www.google.se";

        /* Test */
        var result = utils.parseAndClean(url);

        assert.equal(result, url);
      });

      it("Should add http if url does not start with that", () => {
        /* Setup */
        var url = "www.google.se";

        /* Test */
        var result = utils.parseAndClean(url);

        assert.equal('http://' + url, result);
      });
    });
  });
});