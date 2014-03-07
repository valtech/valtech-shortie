﻿/// <reference path="../../.types/node/node.d.ts" />

import model = require('./model');

export class ShortieRepository {
  private db: any;
  private pageSize: number;

  constructor(db, options: ShortieRepositoryOptions = {pageSize : 20}) {
    this.db = db;
    this.pageSize = options.pageSize;
    this.db.ensureIndex({ fieldName: 'slug', unique: true });
  }

  public addShortie(shortie: model.Shortie, callback?: (err: string, doc?: model.Shortie) => void): void {
    if (callback)
      this.db.insert(shortie, callback);
    else
      this.db.insert(shortie);
  }

  public getShortieBySlug(slug: string, callback: (err: string, doc: model.Shortie) => void): void {
    this.db.findOne({ slug: slug }, callback);
  }

  public getShortiesByUrl(url: string, callback: (err: string, doc: Array<model.Shortie>) => void) {
    return this.db.find({ url: url }, callback);
  }

  public getAllShorties(callback: (err: string, doc: Array<model.Shortie>) => void, options?: ShortieGetOptions) {
    var dbQuery = this.db.find({});

    if (!options) 
      return dbQuery.exec(callback);

    if (options.page !== undefined)
      dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);
    
    if (options.sort)
      dbQuery.sort(options.sort);

    return dbQuery.exec(callback);
  }
}


export interface ShortieGetOptions {
  page?: number;
  sort? : any;
}

export interface ShortieRepositoryOptions {
  pageSize? : number;
}

