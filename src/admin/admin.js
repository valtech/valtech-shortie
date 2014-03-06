var ko = require('knockout');

var viewModels = require('./viewModels');
var model = require('../shorties/model');

var raws = [
    new model.Shortie("fun", "http://9gag.com/trending"),
    new model.Shortie("funner", "http://9gag.com/hot"),
    new model.Shortie("funniest", "http://money.cnn.com/data/markets/")
];

var o = new viewModels.AdminViewModel(raws);

ko.applyBindings(o, document.getElementById('organizer'));
