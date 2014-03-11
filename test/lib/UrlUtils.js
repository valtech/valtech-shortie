var utils = require('../../src/lib/UrlUtils');

var chai = require('chai');
var assert = chai.assert;

describe('UrlUtils', function () {
    describe('parseAndClean()', function () {
        describe('adding http', function () {
            it('Should do nothing if url has http', function () {
                var url = "http://www.google.se";

                var result = utils.parseAndClean(url);

                assert.equal(result, url);
            });

            it("Should do nothing if url starts with https", function () {
                var url = "https://www.google.se";

                var result = utils.parseAndClean(url);

                assert.equal(result, url);
            });

            it("Should add http if url does not start with that", function () {
                var url = "www.google.se";

                var result = utils.parseAndClean(url);

                assert.equal('http://' + url, result);
            });
        });
    });
});
