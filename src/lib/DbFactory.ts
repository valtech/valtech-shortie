/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />

var log = require('../log');


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
          auto_reconnect: true,
          socketOptions: {
            connectTimeoutMS:3600000,
            keepAlive:3600000,
            socketTimeoutMS:3600000
          }
        }
      };
      var connectAttempts = 0;
      var connectWithRetry = () => {
        connectAttempts += 1;
        mongodb.MongoClient.connect(options.mongoUrl, mongoOptions, (err, db) => {
          if (err) {
            if (connectAttempts >= 5) return callback(err);
            log.error('Failed to connect to mongo on startup - retrying in 5s', { attempt: connectAttempts });
            setTimeout(connectWithRetry, 5000);
            return;
          }
          var shortiesCollection = db.collection('shorties');
          shortiesCollection.ensureIndex({ slug: 1 }, { unique: true, background: true }, function(err) { if (err) throw err; });
          callback(null, shortiesCollection);
        });
      };
      connectWithRetry();
      break;
  }
}
