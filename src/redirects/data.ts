/// <reference path="../../types/node.d.ts" />

export class RedirectRepository {
    private db : any;

    constructor(db) {
      this.db = db;
    }

    public addRedirect(redirect: any, callback? : (err : string, doc : any) => void) {
        if (callback)
            this.db.insert(redirect, callback);
        else
            this.db.insert(redirect);
    }

    public getRedirectBySlug(slug : string) {
        return this.db.findOne({ slug: slug });
    }
    
    public getRedirectsByUrl(url : string) {
        return this.db.find({ url: url });
    }
}
