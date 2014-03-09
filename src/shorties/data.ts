﻿/// <reference path="../../.types/node/node.d.ts" />

import model = require('./model');

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
    this.db.findOne({ slug: slug }, callback);
  }

  public getShortiesByUrl(url: string, callback: (err: string, doc: Array<model.Shortie>) => void) {
    return this.db.find({ url: url }).toArray(callback);
  }

  public getAllShorties(callback: (err: string, doc: Array<model.Shortie>) => void, options?: ShortieGetOptions) {
    var dbQuery = this.db.find({});

    if (!options)
      return dbQuery.toArray(callback);

    if (options.page !== undefined)
      dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);

    if (options.sort)
      dbQuery.sort(options.sort);

    dbQuery.toArray(callback);
  }

  public removeShortie(slug: string, callback: (err: any, num?: number) => void) {
    this.db.remove({slug: slug}, callback);
  }
}


export interface ShortieGetOptions {
  page?: number;
  sort? : any;
}

export interface ShortieRepositoryOptions {
  pageSize? : number;
}


