/// <reference path="config.d.ts" />
var configurations = require('./configurations');

function current() {
    switch (process.env.NODE_ENV) {
        case 'development':
            return configurations.development;
        case 'production':
            return configurations.production;
    }
    return null;
}
exports.current = current;
