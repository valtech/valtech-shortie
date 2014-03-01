/// <reference path="../../.types/mocha.d.ts"/>
/// <reference path="../../.types/sinon.d.ts"/>
/// <reference path="../../.types/my-chai.d.ts"/>
/// <reference path="../../src/viewmodels/shortie-vm.ts"/>
/// <reference path="../../src/viewmodels/organizer.ts"/>

import shortie = require('../../src/viewmodels/shortie-vm');
import organizer = require('../../src/viewmodels/organizer');

import chai = require('chai');
var assert : Assert = chai.assert;

import sinonModule = require('sinon');
var sinon: SinonStatic = sinonModule;

describe("The 'organizer'", ()=> {
	var raws: Array<shortie.obj>;

	beforeEach(()=> {
		raws = [
			new shortie.obj("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
			new shortie.obj("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
			new shortie.obj("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
		];
	});

	it("Should create vms for all raw shories in constructor", ()=> {
		/* Setup */
		var spy = sinon.spy(shortie.vm);
		
		/* Test */
		var model = new organizer.vm(raws);

		/* Assert */
		//sinon.assert.callCount(spy, 3); // TODO: make this work.
		assert.equal(model.shorties().length, 3);
	});
})