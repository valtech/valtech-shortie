/// <reference path="../../.types/mocha.d.ts"/>
/// <reference path="../../.types/my-chai.d.ts"/>
/// <reference path="../../src/admin/shortie.ts"/>

import shortie = require('../../src/admin/shortie');
import model = require('../../src/redirects/model');
import chai = require('chai');

// setup short handlers
var assert = chai.assert;
var expect = chai.expect;

describe('The shortie-vm', () => {
	it("Should not be selected by default", ()=> {
		/* Setup */
    var viewModel = new shortie.RedirectViewModel();
		
		/* Assert */
    assert.isNotNull(viewModel);
	});

	it("Should initialize properties from constructor", ()=> {
		/* Setup */
		var raw = new model.RedirectModel("not-that-tall", "http://www.thetallestmanonearth.com/");

		/* Test */
    var viewModel = new shortie.RedirectViewModel(raw);

		/* Assert */
    expect(viewModel.fullUrl()).to.equal(raw.fullUrl);
    expect(viewModel.slug()).to.equal(raw.slug);
	});
});
