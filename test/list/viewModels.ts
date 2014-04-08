/// <reference path="../../.types/mocha/mocha.d.ts"/>
/// <reference path="../../.types/sinon/sinon.d.ts"/>
/// <reference path="../../.types/my-chai/my-chai.d.ts"/>
/// <reference path="../../src/list/viewModels.ts"/>

import viewModels = require('../../src/list/viewModels');
import api = require('../../src/api/api');
import model = require('../../src/shorties/model');

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
      sendRequest: function () {}
    };
    listViewModel = new viewModels.ListViewModel(apiClient);
  });

  describe('loadShorties()', function () {
    it("should create ShortieViewModels for all Shorties", function () {
      apiClient.sendRequest = function (request, callback) {
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

  describe("addNew()", function () {
    beforeEach(function () {
    });
    it("should add a new ShortieViewModel if request is OK", function () {
      listViewModel.addNew();

      expect(listViewModel.shorties().length).to.be.equal(1);
    });

    it("should set newly added ShortieViewModel as current", function () {
      listViewModel.addNew();
      expect(listViewModel.shorties()[0].isCurrent()).to.be.true;
    });

    it("should prevent creation of multiple empty shorties", function () {
      listViewModel.addNew();
      listViewModel.addNew();
      expect(listViewModel.shorties().length).to.be.equal(1);
    });
  });

  describe("save()", function () {
    var sendRequestSpy: SinonSpy;

    beforeEach(function () {
      listViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      var apiOkResponse = { status: 200, data: {} };
      apiClient.sendRequest = sendRequestSpy = sinon.spy(function (request, callback) { callback(apiOkResponse); });
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

    it('should send PUT request to save existing Shortie', function () {
      var shortie = listViewModel.shorties()[1];
      shortie.isCurrent(true);

      listViewModel.save(shortie);

      sinon.assert.calledWith(sendRequestSpy, { path: '/go-shorty', verb: 'PUT', data: models[1] });
    });

    it('should send PUT request to replace existing Shortie with new slug', function () {
      var shortie = listViewModel.shorties()[1];
      shortie.slug('go-longery');
      shortie.isCurrent(true);

      listViewModel.save(shortie);

      sinon.assert.calledWith(sendRequestSpy, { path: '/go-shorty', verb: 'PUT', data: models[1] });
    });

    it('should send PUT request to save new Shortie', function () {
      var shortie = new viewModels.ShortieViewModel();
      shortie.slug('foo');
      shortie.url('http://foobar');
      listViewModel.shorties.push(shortie);

      listViewModel.save(shortie);

      var expectedRequest: api.ApiRequest = {
        path: '/foo',
        verb: 'PUT',
        data: <model.Shortie>{
          slug: 'foo',
          url: 'http://foobar'
        }
      };
      sinon.assert.calledWith(sendRequestSpy, sinon.match(expectedRequest));
    });
  });

  describe("saveByUrl()", ()=> {
    var sendRequestSpy: SinonSpy;

    it("Should post the url through the api client", () => {
      /* Setup */
      var url = 'http://www.google.se';
      listViewModel.urlForGenerated(url);
      apiClient.sendRequest = sendRequestSpy = sinon.spy((request, callback) => { callback({ status: 200, data: {}}); });

      /* Test */
      listViewModel.saveByUrl();

      /* Assert */
      sinon.assert.called(sendRequestSpy);
    });

    it("Should create ShortieVm and add it to shorties", ()=> {
      /* Setup */
      var url = 'http://www.google.se';
      listViewModel.urlForGenerated(url);
      var generatedShortie = new model.Shortie('sluggy', url);
      apiClient.sendRequest = sendRequestSpy = sinon.spy((request, callback) => { callback({status: 200, data: generatedShortie}); });

      /* Test */
      listViewModel.saveByUrl();

      /* Assert */
      var allShorties = _.map<viewModels.ShortieViewModel, model.Shortie>(listViewModel.shorties(), vm=> vm.shortie);
      assert.equal(allShorties[0], generatedShortie);
    });
  });

  describe("remove()", function() {
    var sendRequestSpy: SinonSpy;
    var shortie: viewModels.ShortieViewModel;

    beforeEach(function () {
      listViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      var apiOkResponse = { status: 200, data: {} };
      apiClient.sendRequest = sendRequestSpy = sinon.spy(function (request, callback) { callback(apiOkResponse); });
      shortie = listViewModel.shorties()[1];
      listViewModel.markShortieForDeletion(shortie);
    });

    it('should call the API with a DELETE request', function() {
      listViewModel.remove();

      sinon.assert.calledWith(sendRequestSpy, sinon.match({
        path: '/' + shortie.shortie.slug,
        verb: 'DELETE'
      }));
    });

    it('should call the API with a DELETE request using the original slug', function() {
      shortie.slug('asdfasdfasdfasdf');
      listViewModel.remove();

      sinon.assert.calledWith(sendRequestSpy, sinon.match({
        path: '/' + shortie.originalSlug,
        verb: 'DELETE'
      }));
    });

    it('should remove the shortie from the list', function() {
      listViewModel.remove();

      expect(listViewModel.shorties().length).to.equal(2);
    });
  });

  describe("The 'spamWarning' property", function () {
    it("Should be false if all shorties have value", function () {
      expect(listViewModel.spamWarning()).to.be.false;
    });

    it("Should be false if one new shorties and no attempt to create new", function () {
      models.push(new model.Shortie('', ''));

      expect(listViewModel.spamWarning()).to.be.false;
    });

    it("Should be true if one new shorties and attempt to create new is performed", function () {
      listViewModel.addNew();

      listViewModel.addNew();

      expect(listViewModel.spamWarning()).to.be.true;
    });

    it("Should be false again if new slug gets values", function () {
      models.push(new model.Shortie('', ''));

      listViewModel.addNew();
      listViewModel.shorties()[0].slug('newSlug');
      listViewModel.shorties()[0].url('newUrl');

      expect(listViewModel.spamWarning()).to.be.false;
    });
  });
});
