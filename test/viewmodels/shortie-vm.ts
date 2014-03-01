/// <reference path="../../.types/mocha.d.ts"/>
/// <reference path="../../.types/my-chai.d.ts"/>
/// <reference path="../../src/viewmodels/shortie-vm.ts"/>
/// <reference path="../../src/models/Shortie.ts"/>

import viewModels = require('../../src/viewmodels/shortie-vm');
import chai = require('chai');

// setup short handlers
var ShortieViewModel = viewModels.ShortieViewModel;
var assert = chai.assert;
var expect = chai.expect;

describe('The shortie-vm', () => {
	it("Should not be selected by default", ()=> {
		/* Setup */
		var model = new ShortieViewModel();
		
		/* Assert */
		assert.isNotNull(model);
	});

	it("Should initialize properties from constructor", ()=> {
		/* Setup */
		var raw: Shortie = {
			slug: "not-that-tall",
			fullUrl: "http://www.thetallestmanonearth.com/",
		};

		/* Test */
		var model = new ShortieViewModel(raw);

		/* Assert */
		expect(model.fullUrl()).to.equal(raw.fullUrl);
		expect(model.slug()).to.equal(raw.slug);
	});
});
