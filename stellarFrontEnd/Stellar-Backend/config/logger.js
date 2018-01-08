"use strict";

// NPM Modules
const simpleNodeLogger                    = require('simple-node-logger');

// Logger Info
const loggerOpts = {
        logFilePath:                      'logger/server.log',
        timestampFormat:                  'DD-MM-YYYY HH:mm:ss.SSS'
      };

const logger                              = simpleNodeLogger.createSimpleLogger( loggerOpts );

module.exports = logger;
