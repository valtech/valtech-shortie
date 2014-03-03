/// <reference path="../../.types/mocha/mocha.d.ts"/>
/// <reference path="../../.types/sinon/sinon.d.ts"/>
/// <reference path="../../.types/my-chai/my-chai.d.ts"/>
/// <reference path="../../src/admin/viewModels.ts"/>

import viewModels = require('../../src/admin/viewModels');
import model = require('../../src/redirects/model');

import _ = require('underscore');
import chai = require('chai');
import sinonModule = require('sinon');

var assert: Assert = chai.assert;
var expect: ExpectStatic = chai.expect;
var sinon: SinonStatic = sinonModule;

describe("AdminViewModel", function() {
  var models: Array<model.RedirectModel>;

  beforeEach(function() {
    models = [
      new model.RedirectModel("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
      new model.RedirectModel("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
      new model.RedirectModel("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
    ];
  });

  describe('constructor()', function () {
    it("should create RedirectViewModels for all RedirectModels", function () {
      //var spy = sinon.spy(viewModels.RedirectViewModel);

      var viewModel = new viewModels.AdminViewModel(models);

      //sinon.assert.callCount(spy, 3); // TODO: make this work.
      assert.equal(viewModel.shorties().length, 3);
    });
  });

  describe("select()", function() {
    var viewModel: viewModels.AdminViewModel;

    beforeEach(function() {
      viewModel = new viewModels.AdminViewModel(models);
    });

    it("should not deselect previous shortie if passed shortie is not part of collection", function () {
      /* Setup */
      var rogueShortie = new viewModels.RedirectViewModel(new model.RedirectModel("rouge", "rougheUrl"));
      var currentShortie = viewModel.shorties()[0];
      currentShortie.isCurrent(true);

      /* Test */
      viewModel.select(rogueShortie);

      /* Assert */
      _.each(viewModel.shorties(), vm=> {
        expect(currentShortie.isCurrent()).to.be.true;
      });
    });

    it("should select shortie if it is part of collection", function() {
      /* Setup */
      var current = viewModel.shorties()[0];

      /* Test */
      viewModel.select(current);

      /* Assert */
      expect(current.isCurrent()).to.be.true;
    });

    it("should deselect the previous shortie", function() {
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

  describe("addNew()", function() {
    var viewModel: viewModels.AdminViewModel;

    beforeEach(function () {
      viewModel = new viewModels.AdminViewModel(models);
    });

    it("should add a new shortie", function() {
      viewModel.addNew();
      expect(viewModel.shorties().length).to.be.equal(4);
    });

    it("should set the newest shortie as current", function() {
      viewModel.addNew();
      expect(viewModel.shorties()[3].isCurrent()).to.be.true;
    });

    it("should prevent creation of multiple empty shorties", function() {
      viewModel.addNew();
      viewModel.addNew();
      expect(viewModel.shorties().length).to.be.equal(4);
    });
  });

  describe("save()", function () {
    var viewModel: viewModels.AdminViewModel;

    beforeEach(function () {
      viewModel = new viewModels.AdminViewModel(models);
    });

    it('should deselect all shorties', function() {
      var current = viewModel.shorties()[0]
			current.isCurrent(true);

      /* Test */
      viewModel.save(current);

      /* Assert */
      _.each(viewModel.shorties(), vm => {
        expect(vm.isCurrent()).to.be.false;
      });
    });
  });

  describe("The 'spamWarning' property", function() {
    it("Should be false if all shorties have value", function() {
      /* Setup */
      var model = new viewModels.AdminViewModel(models);

      /* Assert */
      expect(model.spamWarning()).to.be.false;
    });

    it("Should be false if one new shorties and no attempt to create new", function() {
      /* Setup */
      models.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(models);

      /* Assert */
      expect(viewModel.spamWarning()).to.be.false;
    });

    it("Should be true if one new shorties and attempt to create new is performed", function() {
      /* Setup */
      models.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(models);

      /* Test */
      viewModel.addNew();

      /* Assert */
      expect(viewModel.spamWarning()).to.be.true;
    });

    it("Should be false again if new slug gets values", function() {
      /* Setup */
      models.push(new model.RedirectModel('', ''));
      var viewModel = new viewModels.AdminViewModel(models);
      viewModel.addNew();

      /* Test */
      viewModel.shorties()[3].slug('newSlug');
      viewModel.shorties()[3].url('newUrl');

      /* Assert */
      expect(viewModel.spamWarning()).to.be.false;
    });
  });
});