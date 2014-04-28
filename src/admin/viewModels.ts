/// <reference path="../../.types/underscore/underscore.d.ts"/>
/// <reference path="../../.types/node/node.d.ts"/>
/// <reference path="../../.types/knockout/knockout.d.ts"/>

import ko = require('knockout');
import _ = require('underscore');
import utils = require('../lib/UrlUtils');
import api = require('../api/api');
import model = require('../shorties/model');

export class IndexViewModel {
  private apiClient: api.ApiClient;
  public urlToShorten: KnockoutObservable<string>;
  public slug: KnockoutObservable<string>;

  constructor(apiClient: api.ApiClient) {
    this.apiClient = apiClient;
    this.urlToShorten = ko.observable<string>();
    this.slug = ko.observable<string>();
  }

  public generateShortie(): void {
    this.apiClient.sendRequest<model.Shortie>(
      {
        path: '/',
        verb: 'POST',
        data: { url: utils.parseAndClean(this.urlToShorten())}
      },
      (response: api.ApiResponse<model.Shortie>)=> {
        this.slug(response.data.slug);
      }); 
  }
}