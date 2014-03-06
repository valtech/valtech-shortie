/// <reference path="../../.types/node/node.d.ts" />

import model = require('./model');

export class RedirectRepository {
  private db: any;
  private pageSize: number;

  constructor(db, options: RedirectRepoOptions = {pageSize : 20}) {
    this.db = db;
    this.pageSize = options.pageSize;
    this.db.ensureIndex({ fieldName: 'slug', unique: true });
  }

  public addRedirect(redirect: model.RedirectModel, callback?: (err: string, doc?: model.RedirectModel) => void): void {
    if (callback)
      this.db.insert(redirect, callback);
    else
      this.db.insert(redirect);
  }

  public getRedirectBySlug(slug: string, callback: (err: string, doc: model.RedirectModel) => void): void {
    this.db.findOne({ slug: slug }, callback);
  }

  public getRedirectsByUrl(url: string, callback: (err: string, doc: Array<model.RedirectModel>) => void) {
    return this.db.find({ url: url }, callback);
  }

  public getAllShorties(callback: (err: string, doc: Array<model.RedirectModel>) => void, options?: ShortieGetOptions) {
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

export interface RedirectRepoOptions {
  pageSize? : number;
}


