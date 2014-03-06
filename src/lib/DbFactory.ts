/// <reference path="../../.types/node/node.d.ts" />

var Datastore = require('nedb');

export function create(type: string, options: any, callback: (err: string, db: any) => void): void {
  var db: any;
  switch (type) {
    case 'nedb':
      db = new Datastore(options);
      break;
    case 'mongodb':
      break;
  }
  callback(null, db);
}