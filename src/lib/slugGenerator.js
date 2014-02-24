var slugLength = 5;
var allowedChars = 'bcdfghjklmnpqrstvwxz';

module.exports = function() {
  var chars = [];
  for (var i = 0; i < slugLength; i++) {
    var charIndex = Math.floor(Math.random() * allowedChars.length);
    var c = allowedChars[charIndex];
    chars.push(c);
  }
  return chars.join('');
};