import authModel = require('../auth/model');

export class Shortie {
  constructor(
    public slug: string, 
    public url: string, 
    public type: ShortieType = ShortieType.Unknown,
    public lastModifiedTimestamp: number = 0,
    public lastModifiedBy: authModel.User = null) { }
}

export enum ShortieType {
  Unknown,
  Generated,
  Manual
}