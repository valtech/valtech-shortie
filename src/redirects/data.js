/// <reference path="../../.types/node/node.d.ts" />
var RedirectRepository = (function () {
    function RedirectRepository(db) {
        this.db = db;
    }
    RedirectRepository.prototype.addRedirect = function (redirect, callback) {
        if (callback)
            this.db.insert(redirect, callback);
        else
            this.db.insert(redirect);
    };

    RedirectRepository.prototype.getRedirectBySlug = function (slug) {
        return this.db.findOne({ slug: slug });
    };

    RedirectRepository.prototype.getRedirectsByUrl = function (url) {
        return this.db.find({ url: url });
    };
    return RedirectRepository;
})();
exports.RedirectRepository = RedirectRepository;
