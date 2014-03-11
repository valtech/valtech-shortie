/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />

export function create(type: string, options: any, callback: (err: any, db?: any) => void): void {
  switch (type) {
    case 'nedb':
      var Nedb = require('nedb');
      process.nextTick(function() {
        // Make the nedb callback async to behave the same as for mongodb
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
            connectTimeoutMS:3600000,
            keepAlive:3600000,
            socketTimeoutMS:3600000
          }
        }
      };
      mongodb.MongoClient.connect(options.mongoUrl, mongoOptions, (err, db) => {
        if (err) return callback(err);
        var shortiesCollection = db.collection('shorties');
        callback(null, shortiesCollection);
      });
      break;
  }
}
