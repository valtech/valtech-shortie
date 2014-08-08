/// <reference path="../../.types/node/node.d.ts" />

var defaultSlugLength = 5;
var defaultAllowedChars = 'bcdfghjklmnpqrstvwxz';

export function generate(slugLength?: number, allowedChars?: string): string {
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
