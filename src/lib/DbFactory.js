function create(type, options, callback) {
    switch (type) {
        case 'nedb':
            var Nedb = require('nedb');
            process.nextTick(function () {
                var inMemoryDb = new Nedb(options);
                inMemoryDb.ensureIndex({ field: 'slug', unique: true });
                callback(null, inMemoryDb);
            });
            break;
        case 'mongodb':
            var mongodb = require('mongodb');
            mongodb.MongoClient.connect(options.mongoUrl, function (err, db) {
                if (err)
                    return callback(err);
                var shortiesCollection = db.collection('shorties');
                callback(null, shortiesCollection);
            });
            break;
    }
}
exports.create = create;
