var path = require('path');

exports.index = function(req, res) {
  res.render('index');
};
exports.admin = function(req, res) {
  res.render('admin');
};
