/// <reference path="../../.types/node/node.d.ts" />
var Datastore = require('nedb');

function create(type, options, callback) {
    var db;
    switch (type) {
        case 'nedb':
            db = new Datastore(options);
            break;
        case 'mongodb':
            break;
    }
    callback(null, db);
}
exports.create = create;
