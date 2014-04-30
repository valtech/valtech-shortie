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

var fullUrlElement: any = document.getElementById('fullUrl');

function focusOnFullUrl() {
  fullUrlElement.focus();
  fullUrlElement.setSelectionRange(0, fullUrlElement.value.length);
}

indexViewModel.fullUrl.subscribe(focusOnFullUrl);
indexViewModel.showInfoPanel.subscribe(focusOnFullUrl);
indexViewModel.slug.subscribe(focusOnFullUrl);
indexViewModel.isEditingSlug.subscribe(focusOnFullUrl);
$('#fullUrl').click(focusOnFullUrl);
$('#generateShortieButton').click(focusOnFullUrl);
