/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />
var Datastore = require('nedb');
var mongodb = require('mongodb');

function create(type, options, callback) {
    switch (type) {
        case 'nedb':
            var inMemoryDb = new Datastore(options);
            return callback(null, inMemoryDb);
        case 'mongodb':
            mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/shortie?w=1', function (err, mongoDb) {
                if (err)
                    throw err;

                var collection = mongoDb.collection('test');
                collection.ensureIndex({ "slug": 1 }, { unique: true }, function () {
                    callback(null, collection);
                });
            });
            break;
    }
}
exports.create = create;
