/// <reference path="../../types/node.d.ts" />
var SlugGenerator = (function () {
    function SlugGenerator(slugLength, allowedChars) {
        this.slugLength = slugLength || 5;
        this.allowedChars = allowedChars || 'bcdfghjklmnpqrstvwxz';
    }
    SlugGenerator.prototype.generate = function () {
        var chars = [];
        for (var i = 0; i < this.slugLength; i++) {
            var charIndex = Math.floor(Math.random() * this.allowedChars.length);
            var c = this.allowedChars[charIndex];
            chars.push(c);
        }
        return chars.join('');
    };
    SlugGenerator.generate = function (slugLength, allowedChars) {
        return new SlugGenerator(slugLength, allowedChars).generate();
    };
    return SlugGenerator;
})();
module.exports = SlugGenerator;
