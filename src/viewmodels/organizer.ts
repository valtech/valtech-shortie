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

	constructor(raws: Array<shortie.obj>) {
		var arrayOfVms = _.map(raws, raw => new shortie.vm(raw));
		this.shorties = ko.observableArray(arrayOfVms);
	}

	select(shortie: shortie.vm) : void {
		var current = _.find<shortie.vm>(this.shorties(), s=> s == shortie);
		if (!current)
			return;

		this.shorties().forEach(s=> s.isCurrent(false));
		current.isCurrent(true);
	}
}