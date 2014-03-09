/// <reference path="../../.types/mocha/mocha.d.ts"/>
/// <reference path="../../.types/sinon/sinon.d.ts"/>
/// <reference path="../../.types/my-chai/my-chai.d.ts"/>
/// <reference path="../../src/admin/viewModels.ts"/>

import viewModels = require('../../src/admin/viewModels');
import api = require('../../src/admin/api');
import model = require('../../src/shorties/model');

import _ = require('underscore');
import chai = require('chai');
import sinonModule = require('sinon');

var assert: Assert = chai.assert;
var expect: ExpectStatic = chai.expect;
var sinon: SinonStatic = sinonModule;

describe("AdminViewModel", function () {
  var models: Array<model.Shortie>;
  var apiClient: api.ApiClient;
  var adminViewModel: viewModels.AdminViewModel;

  beforeEach(function () {
    models = [
      new model.Shortie("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
      new model.Shortie("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
      new model.Shortie("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
    ];
    apiClient = {
      sendRequest: function () {}
    };
    adminViewModel = new viewModels.AdminViewModel(apiClient);
  });

  describe('loadShorties()', function () {
    it("should create ShortieViewModels for all Shorties", function () {
      apiClient.sendRequest = function (request, callback) {
        callback({ status: 200, data: models });
      };

      adminViewModel.loadShorties();

      assert.equal(adminViewModel.shorties().length, 3);
    });
  });

  describe("select()", function () {
    beforeEach(function () {
      adminViewModel.shorties(_.map(models, m=> new viewModels.ShortieViewModel(m)));
    });
    it("should not deselect previous shortie if passed shortie is not part of collection", function () {
      /* Setup */
      var rogueShortie = new viewModels.ShortieViewModel(new model.Shortie("rouge", "rougheUrl"));
      var currentShortie = adminViewModel.shorties()[0];
      currentShortie.isCurrent(true);

      /* Test */
      adminViewModel.select(rogueShortie);

      /* Assert */
      _.each(adminViewModel.shorties(), vm=> {
        expect(currentShortie.isCurrent()).to.be.true;
      });
    });

    it("should select shortie if it is part of collection", function () {
      /* Setup */
      var current = adminViewModel.shorties()[0];

      /* Test */
      adminViewModel.select(current);

      /* Assert */
      expect(current.isCurrent()).to.be.true;
    });

    it("should deselect the previous shortie", function () {
      /* Setup */
      var previous = adminViewModel.shorties()[0];
      var next = adminViewModel.shorties()[1];
      previous.isCurrent(true);

      /* Test */
      adminViewModel.select(next);

      /* Assert */
      expect(previous.isCurrent()).to.be.false;
    });
  });

  describe("addNew()", function () {
    beforeEach(function () {
    });
    it("should add a new ShortieViewModel if request is OK", function () {
      adminViewModel.addNew();

      expect(adminViewModel.shorties().length).to.be.equal(1);
    });

    it("should set newly added ShortieViewModel as current", function () {
      adminViewModel.addNew();
      expect(adminViewModel.shorties()[0].isCurrent()).to.be.true;
    });

    it("should prevent creation of multiple empty shorties", function () {
      adminViewModel.addNew();
      adminViewModel.addNew();
      expect(adminViewModel.shorties().length).to.be.equal(1);
    });
  });

  describe("save()", function () {
    var sendRequestSpy: SinonSpy;
    beforeEach(function () {
      adminViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      apiClient.sendRequest = sendRequestSpy = sinon.spy(function (request, callback) { callback(); });
    });

    it('should deselect all shorties', function () {
      var current = adminViewModel.shorties()[0]
      current.isCurrent(true);

      /* Test */
      adminViewModel.save(current);

      /* Assert */
      _.each(adminViewModel.shorties(), vm => {
        expect(vm.isCurrent()).to.be.false;
      });
    });

    it('should send PUT request to save existing Shortie', function () {
      var shortie = adminViewModel.shorties()[1];
      shortie.isCurrent(true);

      adminViewModel.save(shortie);

      sinon.assert.calledWith(sendRequestSpy, { path: '/go-shorty', verb: 'PUT', data: models[1] });
    });

    it('should send PUT request to replace existing Shortie with new slug', function () {
      var shortie = adminViewModel.shorties()[1];
      shortie.slug('go-longery');
      shortie.isCurrent(true);

      adminViewModel.save(shortie);

      sinon.assert.calledWith(sendRequestSpy, { path: '/go-shorty', verb: 'PUT', data: models[1] });
    });

    it('should send PUT request to save new Shortie', function () {
      var shortie = new viewModels.ShortieViewModel();
      shortie.slug('foo');
      shortie.url('http://foobar');
      adminViewModel.shorties.push(shortie);

      adminViewModel.save(shortie);

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

  describe("remove()", function() {
    var sendRequestSpy: SinonSpy;
    var shortie: viewModels.ShortieViewModel;

    beforeEach(function () {
      adminViewModel.shorties(_.map(models, m => new viewModels.ShortieViewModel(m)));
      apiClient.sendRequest = sendRequestSpy = sinon.spy(function (request, callback) { callback(); });
      shortie = adminViewModel.shorties()[1];
    });

    it('should call the API with a DELETE request', function() {
      adminViewModel.remove(shortie);

      sinon.assert.calledWith(sendRequestSpy, sinon.match({
        path: '/' + shortie.shortie.slug,
        verb: 'DELETE'
      }));
    });

    it('should remove the shortie from the list', function() {
      adminViewModel.remove(shortie);

      expect(adminViewModel.shorties().length).to.equal(2);
    });
  });

  describe("The 'spamWarning' property", function () {
    it("Should be false if all shorties have value", function () {
      expect(adminViewModel.spamWarning()).to.be.false;
    });

    it("Should be false if one new shorties and no attempt to create new", function () {
      models.push(new model.Shortie('', ''));

      expect(adminViewModel.spamWarning()).to.be.false;
    });

    it("Should be true if one new shorties and attempt to create new is performed", function () {
      adminViewModel.addNew();

      adminViewModel.addNew();

      expect(adminViewModel.spamWarning()).to.be.true;
    });

    it("Should be false again if new slug gets values", function () {
      models.push(new model.Shortie('', ''));

      adminViewModel.addNew();
      adminViewModel.shorties()[0].slug('newSlug');
      adminViewModel.shorties()[0].url('newUrl');

      expect(adminViewModel.spamWarning()).to.be.false;
    });
  });
});
