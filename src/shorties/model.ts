export class Shortie {
  constructor(public slug: string, public url: string, public type = ShorieType.Unknown) { }
}

export enum ShorieType {
  Unknown,
  Generated,
  Manual
}