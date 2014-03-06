var ShortieRepository = (function () {
    function ShortieRepository(db, options) {
        if (typeof options === "undefined") { options = { pageSize: 20 }; }
        this.db = db;
        this.pageSize = options.pageSize;
        this.db.ensureIndex({ fieldName: 'slug', unique: true });
    }
    ShortieRepository.prototype.addShortie = function (shortie, callback) {
        if (callback)
            this.db.insert(shortie, callback);
        else
            this.db.insert(shortie);
    };

    ShortieRepository.prototype.getShortieBySlug = function (slug, callback) {
        this.db.findOne({ slug: slug }, callback);
    };

    ShortieRepository.prototype.getShortiesByUrl = function (url, callback) {
        return this.db.find({ url: url }, callback);
    };

    ShortieRepository.prototype.getAllShorties = function (callback, options) {
        var dbQuery = this.db.find({});

        if (!options)
            return dbQuery.exec(callback);

        if (options.page !== undefined)
            dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);

        if (options.sort)
            dbQuery.sort(options.sort);

        return dbQuery.exec(callback);
    };
    return ShortieRepository;
})();
exports.ShortieRepository = ShortieRepository;
