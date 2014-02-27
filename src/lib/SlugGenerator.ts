/// <reference path="../../types/node/node.d.ts" />

class SlugGenerator {
  slugLength: number;
  allowedChars: string;
  constructor(slugLength: number, allowedChars: string) {
    this.slugLength = slugLength || 5;
    this.allowedChars = allowedChars || 'bcdfghjklmnpqrstvwxz';
  }
  public generate(): string {
    var chars = [];
    for (var i = 0; i < this.slugLength; i++) {
      var charIndex = Math.floor(Math.random() * this.allowedChars.length);
      var c = this.allowedChars[charIndex];
      chars.push(c);
    }
    return chars.join('');
  }
  static generate(slugLength?: number, allowedChars?: string): string {
    return new SlugGenerator(slugLength, allowedChars).generate();
  }
}
module.exports = SlugGenerator;