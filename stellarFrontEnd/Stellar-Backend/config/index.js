"use strict";

// Internal Config
const color                           = require('./color'),
      DB                              = require('./dbConnection'),
      logger                          = require('./logger');

module.exports = {

  color:                              color,
  DB:                                 DB,
  logger:                             logger

};