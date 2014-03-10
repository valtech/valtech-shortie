var ShortieRepository = (function () {
    function ShortieRepository(db, options) {
        if (typeof options === "undefined") { options = { pageSize: 20 }; }
        this.db = db;
        this.pageSize = options.pageSize;
    }
    ShortieRepository.prototype.addShortie = function (slugToCreateOrReplace, shortie, callback) {
        callback = callback || function () {
        };
        this.db.update({ slug: slugToCreateOrReplace }, shortie, { upsert: true }, callback);
    };

    ShortieRepository.prototype.getShortieBySlug = function (slug, callback) {
        this.db.findOne({ slug: slug }, callback);
    };

    ShortieRepository.prototype.getShortiesByUrl = function (url, callback) {
        return this.db.find({ url: url }).toArray(callback);
    };

    ShortieRepository.prototype.getAllShorties = function (callback, options) {
        var dbQuery = this.db.find({});

        if (!options)
            return dbQuery.toArray(callback);

        if (options.page !== undefined)
            dbQuery.skip(this.pageSize * options.page).limit(this.pageSize);

        if (options.sort)
            dbQuery.sort(options.sort);

        dbQuery.toArray(callback);
    };

    ShortieRepository.prototype.removeShortie = function (slug, callback) {
        this.db.remove({ slug: slug }, callback);
    };
    return ShortieRepository;
})();
exports.ShortieRepository = ShortieRepository;
