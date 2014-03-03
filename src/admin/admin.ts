/// <reference path="../../.types/node.d.ts" />
/// <reference path="../../.types/underscore.d.ts" />
/// <reference path="../../.types/jquery.d.ts" />
/// <reference path="shortie.ts" />

// This is for frontend logic

import ko = require('knockout');
import _ = require('underscore');
import $ = require('jquery');
import shortie = require('./shortie');
import organizer = require('./organizer');
import model = require('../redirects/model');

// temporary shorties
var raws = [
	new model.RedirectModel("fun", "http://9gag.com/trending"),
  new model.RedirectModel("funner", "http://9gag.com/hot"),
  new model.RedirectModel("funniest", "http://money.cnn.com/data/markets/")
];

var o = new organizer.vm(raws);


ko.applyBindings(o, document.getElementById('organizer'))