"use strict";

// NPM Modules
const _                   = require('lodash'),
// Internal Modules
      config              = require('../config'),
      color               = config.color,
      logger              = config.logger;

module.exports = (req, res, next) => {

  if (_.get(req, ['error', 'status'], false)) {

    next();
    return ;

  }

  let finalResponse = {
    status:               true,
    message:              _.get(req, ['body'], {}),
    statusCode:           200
  };

  logger.info("Response: ".info, JSON.stringify(finalResponse).info);

  res.status(200).send(finalResponse);
  return ;

};