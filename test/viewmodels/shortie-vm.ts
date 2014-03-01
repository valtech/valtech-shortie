/// <reference path="../../.types/mocha.d.ts"/>
/// <reference path="../../.types/my-chai.d.ts"/>
/// <reference path="../../src/viewmodels/shortie-vm.ts"/>

import shortie = require('../../src/viewmodels/shortie-vm');
import chai = require('chai');

// setup short handlers
var assert = chai.assert;
var expect = chai.expect;

describe('The shortie-vm', () => {
	it("Should not be selected by default", ()=> {
		/* Setup */
		var model = new shortie.vm();
		
		/* Assert */
		assert.isNotNull(model);
	});

	it("Should initialize properties from constructor", ()=> {
		/* Setup */
		var raw = new shortie.obj("not-that-tall", "http://www.thetallestmanonearth.com/");

		/* Test */
		var model = new shortie.vm(raw);

		/* Assert */
		expect(model.fullUrl()).to.equal(raw.fullUrl);
		expect(model.slug()).to.equal(raw.slug);
	});
});
