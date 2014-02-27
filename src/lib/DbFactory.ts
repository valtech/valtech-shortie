/// <reference path="../../types/node/node.d.ts" />

var Datastore = require('nedb');
//var MongoClient = require('mongodb').MongoClient;

class DbFactory {
  static create(type: string, options: any, callback: (err: string, db: any) => void) {
    switch (type) {
      case 'nedb':
        var db = new Datastore(options);
        callback(null, db);
        break;
      case 'mongodb':
        // MongoClient.connect('somewhere', options, callback);
        break;
    }
  }
}

module.exports = DbFactory;