/// <reference path="../../.types/node.d.ts"/>
/// <reference path="../../.types/knockout.d.ts"/>
/// <reference path="../models/shortie.ts"/>

import ko = require('knockout');

export class ShortieViewModel {
	private raw: Shortie;

	public slug: KnockoutObservable<string>;
	public fullUrl: KnockoutObservable<string>
	public isCurrent: KnockoutObservable<boolean>
	
	constructor(shortie? : Shortie) {
		this.raw = shortie;
		this.isCurrent = ko.observable(false);

		if (shortie) {
			this.slug = ko.observable(shortie.slug);
			this.fullUrl = ko.observable(shortie.fullUrl);
		}
		
		
	}
}