var Datastore = require('nedb');
//var MongoClient = require('mongodb').MongoClient;

var dbFactory = function(type, options, callback) {
  switch (type) {
  case 'nedb':
    var db = new Datastore(options);
    callback(null, db);
    break;
  case 'mongodb':
    // MongoClient.connect('somewhere', options, callback);
    break;
  }
};

module.exports = dbFactory;