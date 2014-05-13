/* global $: false */
/// <reference path="../../../.types/node/node.d.ts" />
/// <reference path="../../../.types/underscore/underscore.d.ts" />
/// <reference path="../../../.types/jquery/jquery.d.ts" />
/// <reference path="../../../.types/bootstrap/bootstrap.d.ts" />

import ko = require('knockout');
import _ = require('underscore');

import viewModels = require('./viewModels');
import model = require('../../shorties/model');
import UrlUtils = require('../../lib/UrlUtils');

var vm = new viewModels.RootViewModel();

ko.applyBindings(vm, document.getElementById('admin-list'));

vm.list.errorMessage.subscribe(function (newValue) {
  if(newValue) {
    $('#errorModal').modal('show');
  }
});
vm.list.loadShorties();
