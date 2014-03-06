/// <reference path="../../.types/node/node.d.ts" />
var RedirectRepository = (function () {
    function RedirectRepository(db, options) {
        if (typeof options === "undefined") { options = { pageSize: 20 }; }
        this.db = db;
        this.pageSize = options.pageSize;
        this.db.ensureIndex({ fieldName: 'slug', unique: true });
    }
    RedirectRepository.prototype.addRedirect = function (redirect, callback) {
        if (callback)
            this.db.insert(redirect, callback);
        else
            this.db.insert(redirect);
    };

    RedirectRepository.prototype.getRedirectBySlug = function (slug, callback) {
        this.db.findOne({ slug: slug }, callback);
    };

    RedirectRepository.prototype.getRedirectsByUrl = function (url, callback) {
        return this.db.find({ url: url }, callback);
    };

    RedirectRepository.prototype.getAllShorties = function (callback, options) {
        var dbQuery = this.db.find({});

        if (!options)
            return dbQuery.exec(callback);

        if (options.page !== undefined)
            dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);

        if (options.sort)
            dbQuery.sort(options.sort);

        return dbQuery.exec(callback);
    };
    return RedirectRepository;
})();
exports.RedirectRepository = RedirectRepository;
