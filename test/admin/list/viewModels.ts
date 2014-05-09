/// <reference path="../../../.types/mocha/mocha.d.ts"/>
/// <reference path="../../../.types/sinon/sinon.d.ts"/>
/// <reference path="../../../.types/my-chai/my-chai.d.ts"/>
/// <reference path="../../../src/admin/list/viewModels.ts"/>

import viewModels = require('../../../src/admin/list/viewModels');
import api = require('../../../src/api/api');
import model = require('../../../src/shorties/model');

import _ = require('underscore');
import chai = require('chai');
import sinonModule = require('sinon');

var assert: Assert = chai.assert;
var expect: ExpectStatic = chai.expect;
var sinon: SinonStatic = sinonModule;

describe("ListViewModel", function () {
  var models: Array<model.Shortie>;
  var apiClient: api.ApiClient;
  var listViewModel: viewModels.ListViewModel;

  beforeEach(function () {
    models = [
      new model.Shortie("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
      new model.Shortie("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
      new model.Shortie("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
    ];
    apiClient = {
      getShortie: function() {},
      getShorties: function () {},
      deleteShortie: function() {},
      saveShortie: function() {},
      saveNewShortie: function() {}
    };
    listViewModel = new viewModels.ListViewModel(apiClient, 'http://valtech_shortie/');
  });

  describe('loadShorties()', function () {
    it("should create ShortieViewModels for all Shorties", function () {
      apiClient.getShorties = function (callback) {
        callback({ status: 200, data: models });
      };

      listViewModel.loadShorties();

      assert.equal(listViewModel.shorties().length, 3);
    });
  });

  describe("select()", function () {
    beforeEach(function () {
      listViewModel.shorties(_.map(models, m=> new viewModels.ShortieViewModel(m)));
    });
    it("should not deselect previous shortie if passed shortie is not part of collection", function () {
      /* Setup */
      var rogueShortie = new viewModels.ShortieViewModel(new model.Shortie("rouge", "rougheUrl"));
      var currentShortie = listViewModel.shorties()[0];
      currentShortie.isCurrent(true);

      /* Test */
      listViewModel.select(rogueShortie);

      /* Assert */
      _.each(listViewModel.shorties(), vm=> {
        expect(currentShortie.isCurrent()).to.be.true;
      });
    });

    it("should select shortie if it is part of collection", function () {
      /* Setup */
      var current = listViewModel.shorties()[0];

      /* Test */
      listViewModel.select(current);

      /* Assert */
      expect(current.isCurrent()).to.be.true;
    });

    it("should deselect the previous shortie", function () {
      /* Setup */
      var previous = listViewModel.shorties()[0];
      var next = listViewModel.shorties()[1];
      previous.isCurrent(true);

      /* Test */
      listViewModel.select(next);

      /* Assert */
      expect(previous.isCurrent()).to.be.false;
    });
  });

  describe("save()", function () {
    var saveShortieSpy: SinonSpy;
    var saveNewShortieSpy: SinonSpy;

    beforeEach(function () {
      listViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      var apiOkResponse = { status: 200, data: {} };
      apiClient.saveShortie = saveShortieSpy = sinon.spy(function (slug, shortie, callback) { callback(apiOkResponse); });
      apiClient.saveNewShortie = saveNewShortieSpy = sinon.spy(function (url, callback) { callback(apiOkResponse); });
    });

    it('should deselect all shorties', function () {
      var current = listViewModel.shorties()[0]
      current.isCurrent(true);

      /* Test */
      listViewModel.save(current);

      /* Assert */
      _.each(listViewModel.shorties(), vm => {
        expect(vm.isCurrent()).to.be.false;
      });
    });

    it('should save existing Shortie', function () {
      var shortie = listViewModel.shorties()[1];
      shortie.isCurrent(true);

      listViewModel.save(shortie);

      sinon.assert.calledWith(saveShortieSpy, sinon.match('go-shorty'), sinon.match(models[1]));
    });

    it('should save existing Shortie with new slug', function () {
      var shortie = listViewModel.shorties()[1];
      shortie.slug('go-longery');
      shortie.isCurrent(true);

      listViewModel.save(shortie);

      sinon.assert.calledWith(saveShortieSpy, sinon.match('go-shorty'), sinon.match(models[1]));
    });
  });

  describe("saveByUrl()", ()=> {
    var saveNewShortieSpy: SinonSpy;

    it("Should post the url through the api client", () => {
      /* Setup */
      var url = 'http://www.google.se';
      listViewModel.urlForGenerated(url);
      apiClient.saveNewShortie = saveNewShortieSpy = sinon.spy((url, callback) => { callback({ status: 200, data: new model.Shortie('', '') }); });

      /* Test */
      listViewModel.saveByUrl();

      /* Assert */
      sinon.assert.called(saveNewShortieSpy);
    });

    it("Should create ShortieVm and add it to shorties", ()=> {
      /* Setup */
      var url = 'http://www.google.se';
      listViewModel.urlForGenerated(url);
      var generatedShortie = new model.Shortie('sluggy', url, model.ShortieType.Generated);
      apiClient.saveNewShortie = saveNewShortieSpy = sinon.spy((url, callback) => { callback({status: 200, data: generatedShortie}); });

      /* Test */
      listViewModel.saveByUrl();

      /* Assert */
      var allShorties = _.map<viewModels.ShortieViewModel, model.Shortie>(listViewModel.shorties(), vm=> vm.shortie);
      assert.equal(allShorties[0], generatedShortie);
    });
  });

  describe("remove()", function() {
    var deleteShortieSpy: SinonSpy;
    var shortie: viewModels.ShortieViewModel;

    beforeEach(function () {
      listViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      var apiOkResponse = { status: 200, data: {} };
      apiClient.deleteShortie = deleteShortieSpy = sinon.spy(function (slug, callback) { callback(apiOkResponse); });
      shortie = listViewModel.shorties()[1];
      listViewModel.markShortieForDeletion(shortie);
    });

    it('should call the API with a DELETE request', function() {
      listViewModel.remove();

      sinon.assert.calledWith(deleteShortieSpy, sinon.match(shortie.shortie.slug));
    });

    it('should call the API with a DELETE request using the original slug', function() {
      shortie.slug('asdfasdfasdfasdf');
      listViewModel.remove();

      sinon.assert.calledWith(deleteShortieSpy, sinon.match(shortie.originalSlug));
    });

    it('should remove the shortie from the list', function() {
      listViewModel.remove();

      expect(listViewModel.shorties().length).to.equal(2);
    });
  });
});
