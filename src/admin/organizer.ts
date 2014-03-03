/// <reference path="../../.types/underscore.d.ts"/>
/// <reference path="../../.types/node.d.ts"/>
/// <reference path="../../.types/knockout.d.ts"/>
/// <reference path="shortie.ts"/>

import knockout = require('knockout');
import underscore = require('underscore');

// this is a hack for better intellisence in vs2013
var _: UnderscoreStatic = underscore;
var ko: KnockoutStatic = knockout;

import shortie = require('./shortie');
import model = require('../redirects/model');

export class vm {
  public shorties: KnockoutObservableArray<shortie.RedirectViewModel>;
  public currentShortie: KnockoutObservable<shortie.RedirectViewModel>;
  public spamWarning: KnockoutComputed<boolean>;

  private spamAttemped: KnockoutObservable<boolean>;
  private containsEmpties: KnockoutComputed<boolean>;

  constructor(raws: Array<model.RedirectModel>) {
    var arrayOfVms = _.map(raws, raw => new shortie.RedirectViewModel(raw));
    this.shorties = ko.observableArray(arrayOfVms);

    this.spamAttemped = ko.observable(false);
    this.containsEmpties = ko.computed(() => containsEmptyShorties(this.shorties()));
    this.spamWarning = ko.computed(() => this.spamAttemped() && this.containsEmpties());
  }

  public select(shortie: shortie.RedirectViewModel) : void {
    var current = _.find<shortie.RedirectViewModel>(this.shorties(), s=> s == shortie);
    if (!current)
      return;

    this.shorties().forEach(s=> s.isCurrent(false));
    current.isCurrent(true);
  }

  public addNew() : void {
    if (this.containsEmpties()) {
      this.spamAttemped(true);
      selectFirstEmptyShorties(this.shorties());
      return;
    }

    var newShortie = new shortie.RedirectViewModel();
    this.shorties.push(newShortie);
    this.select(newShortie);
  }

  public save(shortie: shortie.RedirectViewModel) : void {
    this.shorties().forEach(s=> s.isCurrent(false));
  }
}

function containsEmptyShorties(shorties: Array<shortie.RedirectViewModel>): boolean {
  var hasEmpties = _.any<shortie.RedirectViewModel>(shorties,
    shortie => { return !shortie.slug() || !shortie.fullUrl(); }
    );

  return hasEmpties;
}

function selectFirstEmptyShorties(shorties: Array<shortie.RedirectViewModel>): void {
  shorties.forEach(s=> s.isCurrent(false));
  var firstEmpty = _.find<shortie.RedirectViewModel>(shorties, shortie=> {
    if (!shortie.slug() || !shortie.fullUrl())
      return true;
    return false;
  });

  if (firstEmpty)
    firstEmpty.isCurrent(true);
}
