/// <reference path="../../../.types/node/node.d.ts" />
/// <reference path="../../../.types/underscore/underscore.d.ts" />
/// <reference path="../../../.types/jquery/jquery.d.ts" />

// This is for frontend logic

import ko = require('knockout');
import _ = require('underscore');
import $ = require('jquery');

import viewModels = require('./viewModels');
import model = require('../../shorties/model');
import api = require('../../api/api');

var listViewModel = new viewModels.ListViewModel(new api.ApiClient());

ko.applyBindings(listViewModel, document.getElementById('admin-list'));

listViewModel.loadShorties();
