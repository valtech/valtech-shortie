/// <reference path="../../types/node.d.ts" />
var Datastore = require('nedb');

function create(type, options, callback) {
    switch (type) {
        case 'nedb':
            var db = new Datastore(options);
            callback(null, db);
            break;
        case 'mongodb':
            break;
    }
}
exports.create = create;
