/// <reference path="../../.types/underscore.d.ts"/>
/// <reference path="../../.types/node.d.ts"/>
/// <reference path="../../.types/knockout.d.ts"/>
/// <reference path="shortie-vm.ts"/>

import knockout = require('knockout');
import underscore = require('underscore');

// this is a hack for better intellisence in vs2013
var _: UnderscoreStatic = underscore;
var ko: KnockoutStatic = knockout;

import shortie = require('./shortie-vm');

export class vm {
	public shorties: KnockoutObservableArray<shortie.vm>;
	public currentShortie: KnockoutObservable<shortie.vm>;
	public spamWarning: KnockoutComputed<boolean>;

	private spamAttemped: KnockoutObservable<boolean>;
	private containsEmpties : KnockoutComputed<boolean>;

	constructor(raws: Array<shortie.obj>) {
		var arrayOfVms = _.map(raws, raw => new shortie.vm(raw));
		this.shorties = ko.observableArray(arrayOfVms);

		this.spamAttemped = ko.observable(false);
		this.containsEmpties = ko.computed(()=> containsEmptyShorties(this.shorties()));
		this.spamWarning = ko.computed(()=> this.spamAttemped() && this.containsEmpties());
	}

	public select = (shortie: shortie.vm) => {
		var current = _.find<shortie.vm>(this.shorties(), s=> s == shortie);
		if (!current)
			return;

		this.shorties().forEach(s=> s.isCurrent(false));
		current.isCurrent(true);
	};

	public addNew = () => {
		if (this.containsEmpties()) {
			this.spamAttemped(true);
			selectFirstEmptyShorties(this.shorties());
			return;
		}

		var newShortie = new shortie.vm();
		this.shorties.push(newShortie);
		this.select(newShortie);
	}

	public save = (shortie: shortie.vm) => {
		this.shorties().forEach(s=> s.isCurrent(false));
	}

}

function containsEmptyShorties(shorties: Array <shortie.vm>) : boolean {
	var hasEmpties = _.any<shortie.vm>(shorties,
		shortie => { return !shortie.slug() || !shortie.fullUrl(); }
	);

	return hasEmpties;
}

function selectFirstEmptyShorties(shorties: Array<shortie.vm>): void {
	shorties.forEach(s=> s.isCurrent(false));
	var firstEmpty = _.find<shortie.vm>(shorties, shortie=> {
		if (!shortie.slug() || !shortie.fullUrl())
			return true;
		return false;
	});

	if (firstEmpty)
		firstEmpty.isCurrent(true);
}
