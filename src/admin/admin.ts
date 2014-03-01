/// <reference path="../../.types/node.d.ts" />
/// <reference path="../../.types/underscore.d.ts" />
/// <reference path="../../.types/jquery.d.ts" />

// This is for frontend logic

import _ = require('underscore');
import $ = require('jquery');

_.each(['testing', 'browserify', 'through alerts'], x => {
	window.alert(x);
});
