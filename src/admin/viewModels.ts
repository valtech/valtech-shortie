/// <reference path="../../.types/underscore/underscore.d.ts"/>
/// <reference path="../../.types/node/node.d.ts"/>
/// <reference path="../../.types/knockout/knockout.d.ts"/>

import knockout = require('knockout');
import underscore = require('underscore');

// this is a hack for better intellisence in vs2013
var _: UnderscoreStatic = underscore;
var ko: KnockoutStatic = knockout;

import model = require('../redirects/model');

export class RedirectViewModel {
  private raw: model.RedirectModel;

  public slug: KnockoutObservable<string>;
  public url: KnockoutObservable<string>;
  public isCurrent: KnockoutObservable<boolean>;

  constructor(shortie?: model.RedirectModel) {
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
  public shorties: KnockoutObservableArray<RedirectViewModel>;
  public currentShortie: KnockoutObservable<RedirectViewModel>;
  public spamWarning: KnockoutComputed<boolean>;

  private spamAttemped: KnockoutObservable<boolean>;
  private containsEmpties: KnockoutComputed<boolean>;

  constructor(raws: Array<model.RedirectModel>) {
    var arrayOfVms = _.map(raws, raw => new RedirectViewModel(raw));
    this.shorties = ko.observableArray(arrayOfVms);

    this.spamAttemped = ko.observable(false);
    this.containsEmpties = ko.computed(() => containsEmptyShorties(this.shorties()));
    this.spamWarning = ko.computed(() => this.spamAttemped() && this.containsEmpties());
    this.containsEmpties.subscribe(newValue=> {
      if (newValue === false)
        this.spamAttemped(false);
    });
  }

  public select(shortie: RedirectViewModel): void {
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

    var newShortie = new RedirectViewModel();
    this.shorties.push(newShortie);
    this.select(newShortie);
  }

  public save(shortie: RedirectViewModel): void {
    this.shorties().forEach(s=> s.isCurrent(false));
  }

  public remove(shortie: RedirectViewModel): void {
    this.shorties.remove(shortie);
  }
}

function containsEmptyShorties(shorties: Array<RedirectViewModel>): boolean {
  var hasEmpties = _.any<RedirectViewModel>(shorties,
    shortie => { return !shortie.slug() || !shortie.url(); }
    );

  return hasEmpties;
}

function selectFirstEmptyShorties(shorties: Array<RedirectViewModel>): void {
  shorties.forEach(s=> s.isCurrent(false));
  var firstEmpty = _.find<RedirectViewModel>(shorties, shortie=> {
    if (!shortie.slug() || !shortie.url())
      return true;
    return false;
  });

  if (firstEmpty)
    firstEmpty.isCurrent(true);
}
