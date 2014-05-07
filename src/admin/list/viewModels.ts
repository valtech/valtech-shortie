/// <reference path="../../../.types/underscore/underscore.d.ts"/>
/// <reference path="../../../.types/node/node.d.ts"/>
/// <reference path="../../../.types/knockout/knockout.d.ts"/>
/// <reference path="../../../.types/moment/moment.d.ts"/>

import knockout = require('knockout');
import underscore = require('underscore');
import utils = require('../../lib/UrlUtils');
import moment = require('moment');

// this is a hack for better intellisence in vs2013
var _: UnderscoreStatic = underscore;
var ko: KnockoutStatic = knockout;

import model = require('../../shorties/model');
import api = require('../../api/api');

export class ShortieViewModel {
  public shortie: model.Shortie;

  public isCurrent: KnockoutObservable<boolean>;
  public lastModifiedBy: KnockoutObservable<string>;
  public lastModifiedTime: KnockoutObservable<string>;
  public originalSlug: string;
  public slug: KnockoutObservable<string>;
  public type: KnockoutObservable<string>;
  public url: KnockoutObservable<string>;

  constructor(shortie?: model.Shortie) {
    if (!shortie) {
      shortie = new model.Shortie('', '');
    }
    this.shortie = shortie;
    this.isCurrent = ko.observable(false);
    this.lastModifiedBy = ko.observable<string>();
    this.lastModifiedTime = ko.observable<string>();
    this.originalSlug = shortie.slug;
    this.slug = ko.observable<string>();
    this.url = ko.observable<string>();
    this.type = ko.observable<string>();

    if (shortie.lastModifiedBy) {
      this.lastModifiedBy(shortie.lastModifiedBy.name);
    } else {
      this.lastModifiedBy('someone');
    }
    if (shortie.lastModifiedTimestamp) {
      this.lastModifiedTime(moment(shortie.lastModifiedTimestamp).calendar());
    } else {
      this.lastModifiedTime('sometime');
    }
    this.slug(shortie.slug);
    this.type(model.ShortieType[shortie.type]);
    this.url(shortie.url);

    this.slug.subscribe((newValue) => { shortie.slug = newValue; });
    this.url.subscribe((newValue) => { shortie.url = newValue; });
  }
}

export class ListViewModel {
  public errorMessage: KnockoutObservable<string>;
  public currentShortie: KnockoutObservable<ShortieViewModel>;
  public rootUrl: KnockoutObservable<string>;
  public shorties: KnockoutObservableArray<ShortieViewModel>;
  public spamWarning: KnockoutComputed<boolean>;
  public urlForGenerated : KnockoutObservable<string>;

  private spamAttemped: KnockoutObservable<boolean>;
  private containsEmpties: KnockoutComputed<boolean>;
  private apiClient: api.ApiClient;
  private shortieForDeletion: ShortieViewModel;

  constructor(apiClient: api.ApiClient, rootUrl: string) {
    this.apiClient = apiClient;
    this.errorMessage = ko.observable<string>();
    this.rootUrl = ko.observable<string>(rootUrl);
    this.shorties = <KnockoutObservableArray<ShortieViewModel>>ko.observableArray();
    this.spamAttemped = ko.observable(false);
    this.urlForGenerated = ko.observable<string>();

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

  public deselect(shortie: ShortieViewModel): void {
    shortie.isCurrent(false);
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

  public saveByUrl() {
    this.errorMessage(null);
    this.apiClient.saveNewShortie(utils.parseAndClean(this.urlForGenerated()), (res: api.ApiResponse<model.Shortie>) => {
        if(this.handleError(res))
          return;
        var newShortie = new ShortieViewModel(res.data);
        this.shorties.push(newShortie);
      });
  }

  public save(shortieVm: ShortieViewModel): void {
    this.errorMessage(null);
    if (!this.validateShortie(shortieVm)) {
      return;
    }
    shortieVm.url(utils.parseAndClean(shortieVm.shortie.url));
    var slugInPath = shortieVm.originalSlug === '' ? shortieVm.shortie.slug : shortieVm.originalSlug;
    this.apiClient.saveShortie(slugInPath, shortieVm.shortie, (res) => {
      if(this.handleError(res))
          return;
      if (res.status >= 200 && res.status <= 299) {
        this.shorties().forEach(s=> s.isCurrent(false));
      } else {
        // TODO: Do something
      }
    });
  }

  public remove(): void {
    this.errorMessage(null);
    this.apiClient.deleteShortie(this.shortieForDeletion.originalSlug, (res) => {
      if(this.handleError(res))
          return;
      if (res.status == 200) {
        this.shorties.remove(this.shortieForDeletion);
      } else {
        // TODO: Do something
      }
    });
  }

  public loadShorties() {
    this.errorMessage(null);
    this.apiClient.getShorties((res) => {
      if(this.handleError(res))
          return;
      if (res.status == 200) {
        var arrayOfVms = _.map(res.data, item => new ShortieViewModel(item));
        this.shorties(arrayOfVms);
      }
    });
  }

  public markShortieForDeletion(shortieVm: ShortieViewModel) {
    this.shortieForDeletion = shortieVm;
  }

  private handleError(res) {
    if (!res.status) {
      this.errorMessage('Unable to connect to API.');
      return true;
    }
    if (res.status >= 400 && res.status <= 599) {
      this.errorMessage(res.error);
      return true;
    }
    return false;
  }

  private validateShortie(shortieVm): boolean {
    if (!shortieVm.url()) {
      this.errorMessage('URL cannot be empty.');
      return false;
    }
    if (!shortieVm.slug()) {
      this.errorMessage('Slug cannot be empty.');
      return false;
    }
    if (_.any<ShortieViewModel>(this.shorties(), s => { return s != shortieVm && s.originalSlug === shortieVm.slug(); })) {
      this.errorMessage('Slug already exists.');
      return false;
    }
    return true;
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
