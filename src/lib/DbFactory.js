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
            var mongoOptions = {
                server: {
                    auto_connect: true,
                    socketOptions: {
                        connectTimeoutMS: 3600000,
                        keepAlive: 3600000,
                        socketTimeoutMS: 3600000
                    }
                }
            };
            mongodb.MongoClient.connect(options.mongoUrl, mongoOptions, function (err, db) {
                if (err)
                    return callback(err);
                var shortiesCollection = db.collection('shorties');
                callback(null, shortiesCollection);
            });
            break;
    }
}
exports.create = create;
