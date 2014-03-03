﻿/// <reference path="../../.types/mocha.d.ts"/>
/// <reference path="../../.types/sinon.d.ts"/>
/// <reference path="../../.types/my-chai.d.ts"/>
/// <reference path="../../src/admin/viewModels.ts"/>

import viewModels = require('../../src/admin/viewModels');
import model = require('../../src/redirects/model');

import underscore = require('underscore');
import chai = require('chai');
import sinonModule = require('sinon');

var _: UnderscoreStatic = underscore;
var assert: Assert = chai.assert;
var expect: ExpectStatic = chai.expect;
var sinon: SinonStatic = sinonModule;

describe("The 'viewModels'", () => {
  var raws: Array<model.RedirectModel>;

  beforeEach(() => {
    raws = [
      new model.RedirectModel("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
      new model.RedirectModel("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
      new model.RedirectModel("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
    ];
  });

  it("Should create vms for all raw shories in constructor", () => {
    /* Setup */
    var spy = sinon.spy(viewModels.RedirectViewModel);

    /* Test */
    var model = new viewModels.AdminViewModel(raws);

    /* Assert */
    //sinon.assert.callCount(spy, 3); // TODO: make this work.
    assert.equal(model.shorties().length, 3);
  });

  describe("The 'select' method", () => {
    var viewModel: viewModels.AdminViewModel;

    beforeEach(() => {
      viewModel = new viewModels.AdminViewModel(raws);
    });

    it("Should do nothing if shortie not part of collection", () => {
      /* Setup */
      var rougeShortie = new viewModels.RedirectViewModel(new model.RedirectModel("rouge", "rougheUrl"));

      /* Test */
      viewModel.select(rougeShortie);

      /* Assert */
      _.each(viewModel.shorties(), vm=> {
        expect(vm.isCurrent()).to.be.false;
      });
    });

    it("Should select shortie if part of collection", () => {
      /* Setup */
      var current = viewModel.shorties()[0];

      /* Test */
      viewModel.select(current);

      /* Assert */
      expect(current.isCurrent()).to.be.true;
    });

    it("Should deselect the previous shortie", () => {
      /* Setup */
      var previous = viewModel.shorties()[0];
      var next = viewModel.shorties()[1];
      previous.isCurrent(true);

      /* Test */
      viewModel.select(next);

      /* Assert */
      expect(previous.isCurrent()).to.be.false;
    });
  });

  describe("The 'addNew' method", () => {
    it("Should add a new shortie to the list", () => {
      /* Setup */
      var initialCount = raws.length;
      var model = new viewModels.AdminViewModel(raws);

      /* Test */
      model.addNew();

      /* Assert */
      expect(model.shorties().length).to.be.equal(initialCount + 1);
    });

    it("Should set the newst shortie as current", () => {
      /* Setup */
      var model = new viewModels.AdminViewModel(raws);

      /* Test */
      model.addNew();

      /* Assert */
      expect(model.shorties()[3].isCurrent()).to.be.true;
    });

    it("Should prevent creation of multiple empty shorties", () => {
      /* Setup */
      var initialCount = raws.length;
      var model = new viewModels.AdminViewModel(raws);

      /* Test */
      model.addNew();
      model.addNew(); //spam
      model.addNew(); //spam
      model.addNew(); //spam

      /* Assert */
      expect(model.shorties().length).to.be.equal(initialCount + 1);
    });

    it("Should set empty shortie in focus if present", () => {
      /* Setup */
      raws.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(raws);

      /* Test */
      viewModel.addNew();

      /* Assert */
      expect(viewModel.shorties()[3].isCurrent()).to.be.true;
    });
  });

  describe("The 'save' method", () => {
    it('Should reset current on all slugs', () => {
      /* Setup */
      var model = new viewModels.AdminViewModel(raws);
      var current = model.shorties()[0]
			current.isCurrent(true);

      /* Test */
      model.save(current);

      /* Assert */
      _.each(model.shorties(), vm=> {
        expect(vm.isCurrent()).to.be.false;
      });

    });
  });

  describe("The 'spamWarning' property", () => {
    it("Should be false if all shorties have value", () => {
      /* Setup */
      var model = new viewModels.AdminViewModel(raws);

      /* Assert */
      expect(model.spamWarning()).to.be.false;
    });

    it("Should be false if one new shorties and no attempt to create new", () => {
      /* Setup */
      raws.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(raws);

      /* Assert */
      expect(viewModel.spamWarning()).to.be.false;
    });

    it("Should be true if one new shorties and attempt to create new is performed", () => {
      /* Setup */
      raws.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(raws);

      /* Test */
      viewModel.addNew();

      /* Assert */
      expect(viewModel.spamWarning()).to.be.true;
    });

    it("Should be false again if new slug gets values", () => {
      /* Setup */
      raws.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(raws);
      viewModel.addNew();

      /* Test */
      viewModel.shorties()[3].slug('newSlug');
      viewModel.shorties()[3].fullUrl('newUrl');

      /* Assert */
      expect(viewModel.spamWarning()).to.be.false;
    });
  });
});