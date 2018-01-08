"use strict";

// NPM Modules
const _                   = require('lodash'),
// Internal Modules
      config              = require('../config'),
      color               = config.color,
      logger              = config.logger;

module.exports = (req, res) => {

  let resError = {
    status:               false,
    error:                _.get(req, ['error'], {}),
    statusCode:           _.get(req, ['error', 'statusCode'], 509)
  };

  logger.error("Response: ", JSON.stringify(resError).error);

  res.status(_.get(resError, ['statusCode'], 509)).send(resError);
  return ;

};