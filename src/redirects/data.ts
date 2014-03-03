/// <reference path="../../.types/node/node.d.ts" />

import model = require('./model');

export class RedirectRepository {
    private db : any;

    constructor(db) {
      this.db = db;

      this.db.ensureIndex({ fieldName: 'slug', unique: true });
    }

    public addRedirect(redirect: model.RedirectModel, callback? : (err : string, doc? : model.RedirectModel) => void) : void {
        if (callback)
            this.db.insert(redirect, callback);
        else
            this.db.insert(redirect);
    }

    public getRedirectBySlug(slug : string, callback : (err : string, doc : model.RedirectModel) => void) : void {
        this.db.findOne({ slug: slug }, callback);
    }
    
    public getRedirectsByUrl(url : string, callback : (err : string, doc : Array<model.RedirectModel>) => void) {
        return this.db.find({ url: url }, callback);
    }
}
