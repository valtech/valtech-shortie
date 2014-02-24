exports.index = function(req, res) {
  res.sendfile('views/index.html');
};
exports.admin = function(req, res) {
  res.sendfile('views/admin.html');
};