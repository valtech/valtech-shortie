/// <reference path="../../types/node/node.d.ts" />
var Datastore = require('nedb');

//var MongoClient = require('mongodb').MongoClient;
var DbFactory = (function () {
    function DbFactory() {
    }
    DbFactory.create = function (type, options, callback) {
        switch (type) {
            case 'nedb':
                var db = new Datastore(options);
                callback(null, db);
                break;
            case 'mongodb':
                break;
        }
    };
    return DbFactory;
})();

module.exports = DbFactory;
