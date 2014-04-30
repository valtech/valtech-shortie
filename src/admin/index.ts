/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />
/// <reference path="../../.types/jquery/jquery.d.ts" />

// This is for frontend logic

import ko = require('knockout');
import _ = require('underscore');
import $ = require('jquery');

import viewModels = require('./viewModels');
import model = require('../shorties/model');
import api = require('../api/api');

var rootUrl = 'http://' + window.location.host + '/';
var indexViewModel = new viewModels.IndexViewModel(new api.ApiClient(), rootUrl);

ko.applyBindings(indexViewModel, document.getElementById('admin-main'));
