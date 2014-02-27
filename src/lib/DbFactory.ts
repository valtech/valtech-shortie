/// <reference path="../../types/node/node.d.ts" />

var Datastore = require('nedb');

export function create(type: string, options: any, callback: (err: string, db: any) => void) : void {
  switch (type) {
    case 'nedb':
      var db = new Datastore(options);
      callback(null, db);
      break;
    case 'mongodb':
      break;
  }
}