"use strict";

// NPM Modules
const Q                             = require('q'),
      REQUEST                       = require('request'),
      _                             = require('lodash'),
// Internal Modules
      config                        = require('../config'),
      color                         = config.color,
      logger                        = config.logger;

module.exports = {

  makeRequest: reqOps => {

    let deferred = Q.defer();

    logger.info("Making request with: ".info, JSON.stringify(reqOps).info);

    REQUEST(reqOps, (err, response, body) => {

      let statusCode = _.get(response, 'statusCode', 509);

      if (err || !response) {

        let errRes = {
          status: false,
          message: err || "Unknown error",
          statusCode: statusCode
        };

        deferred.reject(errRes);
        return ;
      }

      try {
        if ((typeof body).toLowerCase() === 'string') {
          body = JSON.parse(body);
        }
      }
      catch (e) {

        let errParse = {
          status: false,
          message: "Unable to parse response, error: " + e,
          statusCode: statusCode
        };
        
        deferred.reject(errParse);
        return ;

      }

      let success = {
        status: true,
        result: body,
        statusCode: statusCode
      };
      
      console.log(body);
      deferred.resolve(success);
      return ;

    });

    return deferred.promise;
  }
};