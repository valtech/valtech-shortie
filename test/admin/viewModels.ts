/// <reference path="../../.types/mocha/mocha.d.ts"/>
/// <reference path="../../.types/sinon/sinon.d.ts"/>
/// <reference path="../../.types/my-chai/my-chai.d.ts"/>
/// <reference path="../../src/admin/list/viewModels.ts"/>

import viewModels = require('../../src/admin/viewModels');
import api = require('../../src/api/api');
import model = require('../../src/shorties/model');

import _ = require('underscore');
import chai = require('chai');
import sinonModule = require('sinon');

var assert: Assert = chai.assert;
var expect: ExpectStatic = chai.expect;
var sinon: SinonStatic = sinonModule;

describe("IndexViewModel", function () {
  var models: Array<model.Shortie>;
  var apiClient: api.ApiClient;
  var viewModel: viewModels.IndexViewModel;

  beforeEach(function () {
    models = [
      new model.Shortie("slug1", "http://google.com/", model.ShortieType.Manual),
      new model.Shortie("slvgt", "http://altavista.com/", model.ShortieType.Generated)
    ];
    apiClient = {
      getShortie: function() {},
      getShorties: function () {},
      deleteShortie: function() {},
      saveShortie: function() {},
      saveNewShortie: function() {}
    };
    viewModel = new viewModels.IndexViewModel(apiClient, 'http://valte.ch/');
  });

  describe('when saving with a new slug', function () {
    it("if Shortie was just created, and slug was changed, it should be updated", function () {
      // arrange (create a shortie)
      var saveShortieSpy = apiClient.saveShortie = sinon.spy((url, shortie, callback) => { callback({ data: { } }); });
      viewModel.urlToShorten('http://yahoo.com/');
      var newShortie = new model.Shortie('azsxd', 'http://yahoo.com/', model.ShortieType.Generated);
      apiClient.saveNewShortie = function(url, callback) {
        callback({ data: newShortie, status: 201 });
        // act (change slug and save)
        viewModel.slug('yahoo'); // change the slug
        viewModel.saveSlug();
        // assert (should call correct API method)
        sinon.assert.calledWith(saveShortieSpy, sinon.match('azsxd'), sinon.match(new model.Shortie('yahoo', 'http://yahoo.com/', model.ShortieType.Manual)));
      };
      viewModel.generateShortie();
    });

    it("if Shortie already existed, and slug was changed, a new one should be created", function () {
      // arrange (create a shortie)
      var saveShortieSpy = apiClient.saveShortie = sinon.spy((url, shortie, callback) => { callback({ data: { } }); });
      viewModel.urlToShorten('http://yahoo.com/');
      var newShortie = new model.Shortie('azsxd', 'http://yahoo.com/', model.ShortieType.Generated);
      apiClient.saveNewShortie = function(url, callback) {
        callback({ data: newShortie, status: 200 });
        // act (change slug and save)
        viewModel.slug('yahoo'); // change the slug
        viewModel.saveSlug();
        // assert (should call correct API method)
        sinon.assert.calledWith(saveShortieSpy, sinon.match('yahoo'), sinon.match(new model.Shortie('yahoo', 'http://yahoo.com/', model.ShortieType.Manual)));
      };
      viewModel.generateShortie();
    });
  });
});