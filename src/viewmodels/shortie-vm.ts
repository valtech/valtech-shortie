/// <reference path="../../.types/node.d.ts"/>
/// <reference path="../../.types/knockout.d.ts"/>

import ko = require('knockout');

export class obj {
	constructor(public slug: string, public fullUrl: string) { }
}

export class vm {
	private raw: obj;

	public slug: KnockoutObservable<string>;
	public fullUrl: KnockoutObservable<string>
	public isCurrent: KnockoutObservable<boolean>
	
	constructor(shortie? : obj) {
		this.raw = shortie;
		this.isCurrent = ko.observable(false);

		if (shortie) {
			this.slug = ko.observable(shortie.slug);
			this.fullUrl = ko.observable(shortie.fullUrl);
		}
	}
}