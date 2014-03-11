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
  public shortie: model.Shortie;

  public originalSlug: string;
  public slug: KnockoutObservable<string>;
  public url: KnockoutObservable<string>;
  public isCurrent: KnockoutObservable<boolean>;

  constructor(shortie?: model.Shortie) {
    if (!shortie)
      shortie = new model.Shortie('', '');
    this.shortie = shortie;
    this.isCurrent = ko.observable(false);
    this.originalSlug = shortie.slug;
    this.slug = ko.observable<string>();
    this.url = ko.observable<string>();

    this.slug(shortie.slug);
    this.url(shortie.url);

    this.slug.subscribe((newValue) => { shortie.slug = newValue; });
    this.url.subscribe((newValue) => { shortie.url = newValue; });
  }
}

export class AdminViewModel {
  public shorties: KnockoutObservableArray<ShortieViewModel>;
  public currentShortie: KnockoutObservable<ShortieViewModel>;
  public spamWarning: KnockoutComputed<boolean>;

  private spamAttemped: KnockoutObservable<boolean>;
  private containsEmpties: KnockoutComputed<boolean>;
  private apiClient: api.ApiClient;
  private shortieForDeletion: ShortieViewModel;

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
    this.shorties.unshift(newShortie);
    this.select(newShortie);
  }

  public saveByUrl(url : string) {
    this.apiClient.sendRequest<model.Shortie>(
      {
        path: '/',
        verb: 'POST',
        data: {url : url}
      },
      (response: api.ApiResponse<model.Shortie>)=> {
        var newShortie = new ShortieViewModel(response.data);
        this.shorties.push(newShortie);
      });
  }

  public save(shortieVm: ShortieViewModel): void {
    var self = this;
    var slugInPath = shortieVm.originalSlug === '' ? shortieVm.shortie.slug : shortieVm.originalSlug;
    var saveRequest: api.ApiRequest = {
      path: '/' + slugInPath,
      verb: 'PUT',
      data: shortieVm.shortie
    };
    this.apiClient.sendRequest(saveRequest, function (res) {
      if (res.status >= 200 && res.status <= 299) {
        self.shorties().forEach(s=> s.isCurrent(false));
      } else {
        // TODO: Do something
      }
    });
  }

  public remove(): void {
    var self = this;
    var deleteRequest: api.ApiRequest = {
      path: '/' + this.shortieForDeletion.originalSlug,
      verb: 'DELETE'
    };
    this.apiClient.sendRequest(deleteRequest, function(res) {
      if (res.status == 200) {
        self.shorties.remove(self.shortieForDeletion);
      } else {
        // TODO: Do something
      }
    });
  }

  public loadShorties() {
    this.apiClient.sendRequest<Array<model.Shortie>>({ path: '/', verb: 'GET' }, (response) => {
      if (response.status == 200) {
        var arrayOfVms = _.map(response.data, item => new ShortieViewModel(item));
        this.shorties(arrayOfVms);
      }
    });
  }

  public markShortieForDeletion(shortieVm: ShortieViewModel) {
    this.shortieForDeletion = shortieVm;
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
