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
  private rootUrl: string;
  private isReusedShortie: boolean;
  public urlToShorten: KnockoutObservable<string>;
  public slug: KnockoutObservable<string>;
  private previousSlug: string;
  public fullUrl: KnockoutObservable<string>;
  public showInfoPanel: KnockoutObservable<boolean>;
  public isEditingSlug: KnockoutObservable<boolean>;

  constructor(apiClient: api.ApiClient, rootUrl: string) {
    this.apiClient = apiClient;
    this.rootUrl = rootUrl;
    this.urlToShorten = ko.observable<string>();
    this.slug = ko.observable<string>();
    this.fullUrl = ko.observable<string>();
    this.showInfoPanel = ko.observable<boolean>();
    this.isEditingSlug = ko.observable<boolean>();
  }

  public generateShortie(): void {
    this.apiClient.saveNewShortie(utils.parseAndClean(this.urlToShorten()), (response: api.ApiResponse<model.Shortie>) => {
        this.slug(response.data.slug);
        this.previousSlug = response.data.slug;
        this.fullUrl(this.rootUrl + response.data.slug);
        this.showInfoPanel(true);
        if (response.status == 200) {
          this.isReusedShortie = true;
        }
      });
  }

  public editSlug(): void {
    this.isEditingSlug(true);
  }

  public saveSlug(): void {
    if(!this.isReusedShortie) {
      this.apiClient.saveShortie(this.previousSlug, new model.Shortie(this.slug(), utils.parseAndClean(this.urlToShorten()), model.ShortieType.Manual), (response) => {
        this.previousSlug = response.data.slug;
      });
    } else {
      this.apiClient.saveShortie(this.slug(), new model.Shortie(this.slug(), utils.parseAndClean(this.urlToShorten()), model.ShortieType.Manual), (response) => {
        this.isReusedShortie = false;
      });
    }
  }

  public cancelEditSlug(): void {
    this.isEditingSlug(false);
  }
}