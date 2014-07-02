var winston = require('winston');
var expressWinston = require('express-winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      timestamp: function() {
        return new Date().toISOString()
          .replace(/T/, ' ')
          .replace(/Z/, '');
      },
      colorize: true,
      level: 'silly',
    })
  ],
  levels: {
    silly: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  colors: {
    silly: 'cyan',
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red',
  },
});

module.exports = logger;

module.exports.express = expressWinston.logger({
  transports: [
    logger
  ],
  meta: false,
  msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
});
