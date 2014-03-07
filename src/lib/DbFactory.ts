/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/mongodb/mongodb.d.ts" />

var Datastore = require('nedb');
import mongodb = require('mongodb');

export function create(type: string, options: any, callback: (err: string, db: any) => void): void {
  var db: any;
  switch (type) {
    case 'nedb':
      db = new Datastore(options);
      return callback(null, db);
    case 'mongodb':
      mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/shortie?w=0', (err, mongoDb)=> {
        if (err) throw err;

        return callback(null, mongoDb.collection('test'));
      });
      break;
  }
}