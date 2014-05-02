/* global $: false */
/// <reference path="../../../.types/node/node.d.ts" />
/// <reference path="../../../.types/underscore/underscore.d.ts" />
/// <reference path="../../../.types/jquery/jquery.d.ts" />
/// <reference path="../../../.types/bootstrap/bootstrap.d.ts" />

import ko = require('knockout');
import _ = require('underscore');

import viewModels = require('./viewModels');
import model = require('../../shorties/model');
import api = require('../../api/api');
import UrlUtils = require('../../lib/UrlUtils');

var listViewModel = new viewModels.ListViewModel(new api.ApiClient(), UrlUtils.getRootUrl());

ko.applyBindings(listViewModel, document.getElementById('admin-list'));

listViewModel.errorMessage.subscribe(function (newValue) {
  if(newValue) {
    $('#errorModal').modal('show');
  }
});

listViewModel.loadShorties();
