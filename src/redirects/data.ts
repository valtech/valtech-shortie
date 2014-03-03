/// <reference path="../../.types/node/node.d.ts" />

export class RedirectRepository {
    private db : any;

    constructor(db) {
      this.db = db;

      this.db.ensureIndex({ fieldName: 'slug', unique: true });
    }

    public addRedirect(redirect: any, callback? : (err : string, doc : any) => void) : void {
        if (callback)
            this.db.insert(redirect, callback);
        else
            this.db.insert(redirect);
    }

    public getRedirectBySlug(slug : string, callback : (err : string, doc : any) => void) : void {
        this.db.findOne({ slug: slug }, callback);
    }
    
    public getRedirectsByUrl(url : string, callback : (err : string, doc : any) => void) {
        return this.db.find({ url: url }, callback);
    }
}
