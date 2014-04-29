/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/underscore/underscore.d.ts" />

import model = require('./model');
import _ = require('underscore');

export class ShortieRepository {
  private db: any;
  private pageSize: number;

  constructor(db, options: ShortieRepositoryOptions = {pageSize : 20}) {
    this.db = db;
    this.pageSize = options.pageSize;
  }

  public addShortie(slugToCreateOrReplace: string, shortie: model.Shortie, callback?: (err: string, doc?: model.Shortie) => void): void {
    callback = callback || function() {};
    this.db.update({slug: slugToCreateOrReplace}, shortie, { upsert: true }, callback);
  }

  public getShortieBySlug(slug: string, callback: (err: string, doc: model.Shortie) => void): void {
    this.db.findOne({ slug: slug }, this.callbackWrapper(callback));
  }

  public getShortiesByUrl(url: string, callback: (err: string, doc: Array<model.Shortie>) => void) {
    return this.db.find({ url: url }).toArray(this.callbackWrapper2(callback));
  }

  public getAllShorties(callback: (err: string, doc: Array<model.Shortie>) => void, options?: ShortieGetOptions) {
    var dbQuery = this.db.find({});

    if (!options)
      return dbQuery.toArray(this.callbackWrapper2(callback));

    if (options.page !== undefined)
      dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);

    if (options.sort)
      dbQuery.sort(options.sort);

    dbQuery.toArray(this.callbackWrapper2(callback));
  }

  public removeShortie(slug: string, callback: (err: any, num?: number) => void) {
    this.db.remove({slug: slug}, callback);
  }

  private callbackWrapper(callback: (err: string, doc: model.Shortie) => void) {
    return (err, doc) => {
      var shortie = doc !== null ? new model.Shortie(doc.slug, doc.url, doc.type) : null;
      callback(err, shortie);
    };
  }

  private callbackWrapper2(callback: (err: string, docs: Array<model.Shortie>) => void) {
    return (err, docs) => {
      var shorties = _.map(docs, function(doc: any) {
        return new model.Shortie(doc.slug, doc.url, doc.type);
      });
      callback(err, shorties);
    };
  }
}


export interface ShortieGetOptions {
  page?: number;
  sort? : any;
}

export interface ShortieRepositoryOptions {
  pageSize? : number;
}


