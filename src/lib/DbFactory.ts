/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />

var Datastore = require('nedb');
import mongodb = require('mongodb');

export function create(type: string, options: any, callback: (err: string, db: any) => void): void {
  switch (type) {
    case 'nedb':
      var inMemoryDb = new Datastore(options);
      inMemoryDb.ensureIndex({ field: 'slug', unique: true });
      return callback(null, inMemoryDb);
    case 'mongodb':
      mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/shortie?w=1', (err, mongoDb) => {
        if (err) throw err;

        var collection = mongoDb.collection('test');
        collection.ensureIndex({ "slug": 1 }, { unique: true }, () => {
          callback(null, collection);
        });
      });
      break;
  }
}