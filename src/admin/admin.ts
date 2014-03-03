/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
/// <reference path="../../.types/jquery/jquery.d.ts" />

// This is for frontend logic

import ko = require('knockout');
import _ = require('underscore');
import $ = require('jquery');

import viewModels = require('./viewModels');
import model = require('../redirects/model');

// temporary shorties
var raws = [
	new model.RedirectModel("fun", "http://9gag.com/trending"),
  new model.RedirectModel("funner", "http://9gag.com/hot"),
  new model.RedirectModel("funniest", "http://money.cnn.com/data/markets/")
];

var o = new viewModels.AdminViewModel(raws);


ko.applyBindings(o, document.getElementById('organizer'))