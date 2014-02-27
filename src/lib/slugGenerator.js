/// <reference path="../../types/node.d.ts" />
var defaultSlugLength = 5;
var defaultAllowedChars = 'bcdfghjklmnpqrstvwxz';

function generate(slugLength, allowedChars) {
    slugLength = slugLength || defaultSlugLength;
    allowedChars = allowedChars || defaultAllowedChars;
    var chars = [];
    for (var i = 0; i < slugLength; i++) {
        var charIndex = Math.floor(Math.random() * allowedChars.length);
        var c = allowedChars[charIndex];
        chars.push(c);
    }
    return chars.join('');
}
exports.generate = generate;
