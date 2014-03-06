var ko = require('knockout');

var viewModels = require('./viewModels');
var model = require('../redirects/model');

var raws = [
    new model.RedirectModel("fun", "http://9gag.com/trending"),
    new model.RedirectModel("funner", "http://9gag.com/hot"),
    new model.RedirectModel("funniest", "http://money.cnn.com/data/markets/")
];

var o = new viewModels.AdminViewModel(raws);

ko.applyBindings(o, document.getElementById('organizer'));
