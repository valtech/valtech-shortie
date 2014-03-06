var viewModels = require('../../src/admin/viewModels');
var model = require('../../src/redirects/model');

var _ = require('underscore');
var chai = require('chai');
var sinonModule = require('sinon');

var assert = chai.assert;
var expect = chai.expect;
var sinon = sinonModule;

describe("AdminViewModel", function () {
    var models;

    beforeEach(function () {
        models = [
            new model.RedirectModel("lilla-anna", "http://sv.wikipedia.org/wiki/Lilla_Anna_och_Langa_farbrorn"),
            new model.RedirectModel("go-shorty", "http://rapgenius.com/50-cent-in-da-club-lyrics"),
            new model.RedirectModel("i-wish", "http://open.spotify.com/track/74WFSCXc8yHY7HDXREiLpM")
        ];
    });

    describe('constructor()', function () {
        it("should create RedirectViewModels for all RedirectModels", function () {
            var viewModel = new viewModels.AdminViewModel(models);

            assert.equal(viewModel.shorties().length, 3);
        });
    });

    describe("select()", function () {
        var viewModel;

        beforeEach(function () {
            viewModel = new viewModels.AdminViewModel(models);
        });

        it("should not deselect previous shortie if passed shortie is not part of collection", function () {
            var rogueShortie = new viewModels.RedirectViewModel(new model.RedirectModel("rouge", "rougheUrl"));
            var currentShortie = viewModel.shorties()[0];
            currentShortie.isCurrent(true);

            viewModel.select(rogueShortie);

            _.each(viewModel.shorties(), function (vm) {
                expect(currentShortie.isCurrent()).to.be.true;
            });
        });

        it("should select shortie if it is part of collection", function () {
            var current = viewModel.shorties()[0];

            viewModel.select(current);

            expect(current.isCurrent()).to.be.true;
        });

        it("should deselect the previous shortie", function () {
            var previous = viewModel.shorties()[0];
            var next = viewModel.shorties()[1];
            previous.isCurrent(true);

            viewModel.select(next);

            expect(previous.isCurrent()).to.be.false;
        });
    });

    describe("addNew()", function () {
        var viewModel;

        beforeEach(function () {
            viewModel = new viewModels.AdminViewModel(models);
        });

        it("should add a new shortie", function () {
            viewModel.addNew();
            expect(viewModel.shorties().length).to.be.equal(4);
        });

        it("should set the newest shortie as current", function () {
            viewModel.addNew();
            expect(viewModel.shorties()[3].isCurrent()).to.be.true;
        });

        it("should prevent creation of multiple empty shorties", function () {
            viewModel.addNew();
            viewModel.addNew();
            expect(viewModel.shorties().length).to.be.equal(4);
        });
    });

    describe("save()", function () {
        var viewModel;

        beforeEach(function () {
            viewModel = new viewModels.AdminViewModel(models);
        });

        it('should deselect all shorties', function () {
            var current = viewModel.shorties()[0];
            current.isCurrent(true);

            viewModel.save(current);

            _.each(viewModel.shorties(), function (vm) {
                expect(vm.isCurrent()).to.be.false;
            });
        });
    });

    describe("The 'spamWarning' property", function () {
        it("Should be false if all shorties have value", function () {
            var model = new viewModels.AdminViewModel(models);

            expect(model.spamWarning()).to.be.false;
        });

        it("Should be false if one new shorties and no attempt to create new", function () {
            models.push(new model.RedirectModel('', ''));
            var viewModel = new viewModels.AdminViewModel(models);

            expect(viewModel.spamWarning()).to.be.false;
        });

        it("Should be true if one new shorties and attempt to create new is performed", function () {
            models.push(new model.RedirectModel('', ''));
            var viewModel = new viewModels.AdminViewModel(models);

            viewModel.addNew();

            expect(viewModel.spamWarning()).to.be.true;
        });

        it("Should be false again if new slug gets values", function () {
            models.push(new model.RedirectModel('', ''));
            var viewModel = new viewModels.AdminViewModel(models);
            viewModel.addNew();

            viewModel.shorties()[3].slug('newSlug');
            viewModel.shorties()[3].url('newUrl');

            expect(viewModel.spamWarning()).to.be.false;
        });

        it("Should not be true just because a new shortie is added after previous spamWarning", function () {
            models.push(new model.RedirectModel('', ''));
            var viewModel = new viewModels.AdminViewModel(models);
            viewModel.addNew();
            viewModel.shorties()[3].slug('newSlug');
            viewModel.shorties()[3].url('newUrl');

            viewModel.addNew();

            expect(viewModel.spamWarning()).to.be.false;
        });
    });
});
