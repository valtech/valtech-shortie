var path = require('path');

exports.index = function(req, res) {
  var filePath = path.join(__dirname, '../views/index.html');
  res.sendfile(filePath);
};
exports.admin = function(req, res) {
  var filePath = path.join(__dirname, '../views/admin.html');
  res.sendfile(filePath);
};