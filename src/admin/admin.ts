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

// temporary shorties
var raws = [
	new shortie.obj("fun", "http://9gag.com/trending"),
	new shortie.obj("funner", "http://9gag.com/hot"),
	new shortie.obj("funniest", "http://money.cnn.com/data/markets/")
];

var o = new organizer.vm(raws);


ko.applyBindings(o, document.getElementById('organizer'))