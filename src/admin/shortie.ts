/// <reference path="../../.types/node.d.ts"/>
/// <reference path="../../.types/knockout.d.ts"/>

import ko = require('knockout');

export class RedirectModel {
  constructor(public slug: string, public fullUrl: string) { }
}

export class RedirectViewModel {
  private raw: RedirectModel;

	public slug: KnockoutObservable<string>;
  public fullUrl: KnockoutObservable<string>;
  public isCurrent: KnockoutObservable<boolean>;
	
  constructor(shortie?: RedirectModel) {
		this.raw = shortie;
		this.isCurrent = ko.observable(false);
		this.slug = ko.observable<string>();
		this.fullUrl = ko.observable<string>();

		if (shortie) {
			this.slug(shortie.slug);
			this.fullUrl(shortie.fullUrl);
		}
	}
}