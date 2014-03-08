/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />

var Datastore = require('nedb');
import mongodb = require('mongodb');

var MONGO_URL = 'mongodb://127.0.0.1:27017/valtech_shorties?w=1'

export function create(type: string, options: any, callback: (err: any, db?: any) => void): void {
  switch (type) {
    case 'nedb':
      process.nextTick(function() {
        // Make the nedb callback async to behave the same as for mongodb
        var inMemoryDb = new Datastore(options);
        inMemoryDb.ensureIndex({ field: 'slug', unique: true });
        callback(null, inMemoryDb);
      });
      break;
    case 'mongodb':
      mongodb.MongoClient.connect(MONGO_URL, (err, db) => {
        if (err) return callback(err);
        var shortiesCollection = db.collection('shorties');
        callback(null, shortiesCollection);
      });
      break;
  }
}
