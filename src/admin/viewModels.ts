/// <reference path="../../.types/underscore/underscore.d.ts"/>
/// <reference path="../../.types/node/node.d.ts"/>
/// <reference path="../../.types/knockout/knockout.d.ts"/>

import knockout = require('knockout');
import underscore = require('underscore');

// this is a hack for better intellisence in vs2013
var _: UnderscoreStatic = underscore;
var ko: KnockoutStatic = knockout;

import model = require('../shorties/model');
import api = require('./api');

export class ShortieViewModel {
  private raw: model.Shortie;

  public slug: KnockoutObservable<string>;
  public url: KnockoutObservable<string>;
  public isCurrent: KnockoutObservable<boolean>;

  constructor(shortie?: model.Shortie) {
    this.raw = shortie;
    this.isCurrent = ko.observable(false);
    this.slug = ko.observable<string>();
    this.url = ko.observable<string>();

    if (shortie) {
      this.slug(shortie.slug);
      this.url(shortie.url);
    }
  }
}

export class AdminViewModel {
  public shorties: KnockoutObservableArray<ShortieViewModel>;
  public currentShortie: KnockoutObservable<ShortieViewModel>;
  public spamWarning: KnockoutComputed<boolean>;

  private spamAttemped: KnockoutObservable<boolean>;
  private containsEmpties: KnockoutComputed<boolean>;
  private apiClient: api.ApiClient;

  constructor(apiClient: api.ApiClient) {
    this.apiClient = apiClient;
    this.shorties = <KnockoutObservableArray<ShortieViewModel>>ko.observableArray();
    this.spamAttemped = ko.observable(false);

    this.containsEmpties = ko.computed(() => containsEmptyShorties(this.shorties()));
    this.spamWarning = ko.computed(() => this.spamAttemped() && this.containsEmpties());
    this.containsEmpties.subscribe(newValue=> {
      if (newValue === false)
        this.spamAttemped(false);
    });
  }

  public select(shortie: ShortieViewModel): void {
    if (!_.contains(this.shorties(), shortie))
      return;
    this.shorties().forEach(s=> s.isCurrent(false));
    shortie.isCurrent(true);
  }

  public addNew(): void {
    if (this.containsEmpties()) {
      this.spamAttemped(true);
      selectFirstEmptyShorties(this.shorties());
      return;
    }

    var newShortie = new ShortieViewModel();
    this.shorties.push(newShortie);
    this.select(newShortie);
  }

  public save(shortie: ShortieViewModel): void {
    var self = this;
    var saveRequest: api.ApiRequest = {
      path: '/' + shortie.slug(),
      verb: api.HttpVerb.PUT,
      data: { longUrl: shortie.url() }
    };
    this.apiClient.sendRequest(saveRequest, function (response) {
      self.shorties().forEach(s=> s.isCurrent(false));
    });
  }

  public remove(shortie: ShortieViewModel): void {
    this.shorties.remove(shortie);
  }

  public loadShorties() {
    this.apiClient.sendRequest<Array<model.Shortie>>({ path: '/', verb: api.HttpVerb.GET }, (response) => {
      if (response.status == 200) {
        var arrayOfVms = _.map(response.data, item => new ShortieViewModel(item));
        this.shorties(arrayOfVms);
      }
    });
  }
}

function containsEmptyShorties(shorties: Array<ShortieViewModel>): boolean {
  var hasEmpties = _.any<ShortieViewModel>(shorties,
    shortie => { return !shortie.slug() || !shortie.url(); }
    );

  return hasEmpties;
}

function selectFirstEmptyShorties(shorties: Array<ShortieViewModel>): void {
  shorties.forEach(s=> s.isCurrent(false));
  var firstEmpty = _.find<ShortieViewModel>(shorties, shortie=> {
    if (!shortie.slug() || !shortie.url())
      return true;
    return false;
  });

  if (firstEmpty)
    firstEmpty.isCurrent(true);
}
