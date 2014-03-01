/// <reference path="../../types/underscore.d.ts" />
var _ = require('underscore');
var $ = require('jquery');

_.each(['testing', 'browserify', 'through alerts'], function (x) {
    window.alert(x);
});
