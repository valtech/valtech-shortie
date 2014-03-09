var viewModels = require('../../src/admin/viewModels');
var api = require('../../src/admin/api');
var model = require('../../src/shorties/model');

var _ = require('underscore');
var chai = require('chai');
var sinonModule = require('sinon');

var assert = chai.assert;
var expect = chai.expect;
var sinon = sinonModule;

describe("AdminViewModel", function () {
    var models;
    var apiClient;
    var adminViewModel;

    beforeEach(function () {
        models = [
            new model.Shortie("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
            new model.Shortie("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
            new model.Shortie("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
        ];
        apiClient = {
            sendRequest: function () {
            }
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
            adminViewModel.shorties(_.map(models, function (m) {
                return new viewModels.ShortieViewModel(m);
            }));
        });
        it("should not deselect previous shortie if passed shortie is not part of collection", function () {
            var rogueShortie = new viewModels.ShortieViewModel(new model.Shortie("rouge", "rougheUrl"));
            var currentShortie = adminViewModel.shorties()[0];
            currentShortie.isCurrent(true);

            adminViewModel.select(rogueShortie);

            _.each(adminViewModel.shorties(), function (vm) {
                expect(currentShortie.isCurrent()).to.be.true;
            });
        });

        it("should select shortie if it is part of collection", function () {
            var current = adminViewModel.shorties()[0];

            adminViewModel.select(current);

            expect(current.isCurrent()).to.be.true;
        });

        it("should deselect the previous shortie", function () {
            var previous = adminViewModel.shorties()[0];
            var next = adminViewModel.shorties()[1];
            previous.isCurrent(true);

            adminViewModel.select(next);

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
        var sendRequestSpy;
        beforeEach(function () {
            adminViewModel.shorties(_.map(models, function (m) {
                return new viewModels.ShortieViewModel(m);
            }));
            apiClient.sendRequest = sendRequestSpy = sinon.spy(function (request, callback) {
                callback();
            });
        });

        it('should deselect all shorties', function () {
            var current = adminViewModel.shorties()[0];
            current.isCurrent(true);

            adminViewModel.save(current);

            _.each(adminViewModel.shorties(), function (vm) {
                expect(vm.isCurrent()).to.be.false;
            });
        });
        it('should send PUT request to save existing Shortie', function () {
            var shortie = adminViewModel.shorties()[1];
            shortie.isCurrent(true);

            adminViewModel.save(shortie);

            sinon.assert.calledWith(sendRequestSpy, { path: '/go-shorty', verb: 2 /* PUT */, data: models[1] });
        });
        it('should send PUT request to save new Shortie', function () {
            var shortie = new viewModels.ShortieViewModel();
            shortie.slug('foo');
            shortie.url('http://foobar');
            adminViewModel.shorties.push(shortie);

            adminViewModel.save(shortie);

            var expectedRequest = {
                path: '/foo',
                verb: 2 /* PUT */,
                data: {
                    slug: 'foo',
                    url: 'http://foobar'
                }
            };
            sinon.assert.calledWith(sendRequestSpy, sinon.match(expectedRequest));
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
