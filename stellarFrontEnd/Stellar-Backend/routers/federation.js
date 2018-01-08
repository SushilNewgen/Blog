"use strict";

// NPM Modules
const _                         = require('lodash'),
// Internal Modules
      libs                      = require('../libs'),
      util                      = require('../util'),
      DB                        = libs.DB,
      SCHEMA                    = util.schema,
      SERVICE                   = libs.service;

module.exports = {

  getTransaction: ( req, res, next ) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let query                     = _.get(req, ['query'], {}),
        page                      = _.get(query, ['page'], "1");

    let schema                    = _.get(SCHEMA, 'transactions', {});

    let isValidJSON = SERVICE.validate(page, schema);

    if ( !_.get(isValidJSON, ["ok"], false) ) {

      let invalidError = {
        status:               true,
        error:                isValidJSON,
        statusCode:           422
      };

      _.set(req, ["error"], invalidError);
      return next();

    }

    page                      = parseInt(page);

    DB.getTransaction( page )
    .then( transactions => {

      _.set(req, ['body', 'page'], page);
      _.set(req, ['body', 'transactions'], _.get(transactions, ['rows'], []));
      return next();

    })
    .catch( err => {

      let transactionError = {
        status:                   true,
        error:                    err || "Unable to fetch details from DB",
        statusCode:               500
      };

      _.set(req, ['error'], transactionError);
      return next();

    });

  }

};