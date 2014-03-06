var RedirectRepository = (function () {
    function RedirectRepository(db) {
        this.db = db;

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
    return RedirectRepository;
})();
exports.RedirectRepository = RedirectRepository;
