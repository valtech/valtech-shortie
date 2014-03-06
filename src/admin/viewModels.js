var knockout = require('knockout');
var underscore = require('underscore');

var _ = underscore;
var ko = knockout;

var RedirectViewModel = (function () {
    function RedirectViewModel(shortie) {
        this.raw = shortie;
        this.isCurrent = ko.observable(false);
        this.slug = ko.observable();
        this.url = ko.observable();

        if (shortie) {
            this.slug(shortie.slug);
            this.url(shortie.url);
        }
    }
    return RedirectViewModel;
})();
exports.RedirectViewModel = RedirectViewModel;

var AdminViewModel = (function () {
    function AdminViewModel(raws) {
        var _this = this;
        var arrayOfVms = _.map(raws, function (raw) {
            return new RedirectViewModel(raw);
        });
        this.shorties = ko.observableArray(arrayOfVms);

        this.spamAttemped = ko.observable(false);
        this.containsEmpties = ko.computed(function () {
            return containsEmptyShorties(_this.shorties());
        });
        this.spamWarning = ko.computed(function () {
            return _this.spamAttemped() && _this.containsEmpties();
        });
    }
    AdminViewModel.prototype.select = function (shortie) {
        if (!_.contains(this.shorties(), shortie))
            return;
        this.shorties().forEach(function (s) {
            return s.isCurrent(false);
        });
        shortie.isCurrent(true);
    };

    AdminViewModel.prototype.addNew = function () {
        if (this.containsEmpties()) {
            this.spamAttemped(true);
            selectFirstEmptyShorties(this.shorties());
            return;
        }

        var newShortie = new RedirectViewModel();
        this.shorties.push(newShortie);
        this.select(newShortie);
    };

    AdminViewModel.prototype.save = function (shortie) {
        this.shorties().forEach(function (s) {
            return s.isCurrent(false);
        });
    };

    AdminViewModel.prototype.remove = function (shortie) {
        this.shorties.remove(shortie);
    };
    return AdminViewModel;
})();
exports.AdminViewModel = AdminViewModel;

function containsEmptyShorties(shorties) {
    var hasEmpties = _.any(shorties, function (shortie) {
        return !shortie.slug() || !shortie.url();
    });

    return hasEmpties;
}

function selectFirstEmptyShorties(shorties) {
    shorties.forEach(function (s) {
        return s.isCurrent(false);
    });
    var firstEmpty = _.find(shorties, function (shortie) {
        if (!shortie.slug() || !shortie.url())
            return true;
        return false;
    });

    if (firstEmpty)
        firstEmpty.isCurrent(true);
}
