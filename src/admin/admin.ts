/// <reference path="../../.types/underscore.d.ts" />

// This is for frontend logic

import _ = require('underscore');
var $ = require('jquery');

_.each(['testing', 'browserify', 'through alerts'], function(x) {
  window.alert(x);
});
