/// <reference path="config.d.ts" />

import configurations = require('./configurations');

export function current(): config.Config {
  switch (process.env.NODE_ENV) {
    case 'development':
      return configurations.development;
    case 'production':
      return configurations.production;
  }
  return null;
}
