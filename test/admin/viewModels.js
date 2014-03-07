var viewModels = require('../../src/admin/viewModels');

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
            sendRequest: function (request, callback) {
                callback({ status: 200, data: models });
            }
        };
        adminViewModel = new viewModels.AdminViewModel(apiClient);
    });

    describe('constructor()', function () {
        it("should create ShortieViewModels for all Shorties", function () {
            assert.equal(adminViewModel.shorties().length, 3);
        });
    });

    describe("select()", function () {
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
        it("should add a new shortie", function () {
            adminViewModel.addNew();
            expect(adminViewModel.shorties().length).to.be.equal(4);
        });

        it("should set the newest shortie as current", function () {
            adminViewModel.addNew();
            expect(adminViewModel.shorties()[3].isCurrent()).to.be.true;
        });

        it("should prevent creation of multiple empty shorties", function () {
            adminViewModel.addNew();
            adminViewModel.addNew();
            expect(adminViewModel.shorties().length).to.be.equal(4);
        });
    });

    describe("save()", function () {
        it('should deselect all shorties', function () {
            var current = adminViewModel.shorties()[0];
            current.isCurrent(true);

            adminViewModel.save(current);

            _.each(adminViewModel.shorties(), function (vm) {
                expect(vm.isCurrent()).to.be.false;
            });
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
            adminViewModel.shorties()[3].slug('newSlug');
            adminViewModel.shorties()[3].url('newUrl');

            expect(adminViewModel.spamWarning()).to.be.false;
        });
    });
});
