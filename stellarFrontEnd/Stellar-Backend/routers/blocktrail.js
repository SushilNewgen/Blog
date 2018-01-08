"use strict";

// NPM Modules
const _                               = require("lodash"),
      blocktrail                      = require("blocktrail-sdk"),
// Internal Modules;
      libs                            = require("../libs"),
      util                            = require("../util"),
      APPCONST                        = util.appConst,
      SCHEMA                          = util.schema,
      SERVICE                         = libs.service;

module.exports = {

  transfer: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let body                  = _.get(req, 'body', {}),
        schema                = _.get(SCHEMA, 'receiverAddress', {});

    let isValidJSON = SERVICE.validate(body, schema);

    if ( !_.get(isValidJSON, ["ok"], false) ) {

      let invalidError = {
        status:               true,
        error:                isValidJSON,
        statusCode:           422
      };

      _.set(req, ["error"], invalidError);
      return next();

    }

    let amount                 = _.get(req, ['body', 'amount'], 0),
        receiverAddress        = _.get(req, ['body', 'receiverAddress'], ''),
        clientOps              = _.get(APPCONST, ['clientBTC', 'clientOps'], {}),
        username               = _.get(APPCONST, ['clientBTC', 'username'], ''),
        password               = _.get(APPCONST, ['clientBTC', 'password'], '');

    //Initialising client with API key and API secret
    let client = blocktrail.BlocktrailSDK(clientOps);

    client.initWallet(username, password, (err, wallet) => {

      if(err) {

        let walletError = {
          status:             true,
          error:              err,
          statusCode:         400
        };

        _.set(req, ["error"], walletError);
        return next();

      }

      let paymentOps = {};

      _.set(paymentOps, [receiverAddress], blocktrail.toSatoshi(amount));

      wallet.pay(paymentOps, null, false, true, blocktrail.Wallet.FEE_STRATEGY_BASE_FEE,
      (err, result) => {

        if(err) {
          
          let payError = {
            status:           true,
            error:            err,
            statusCode:       400
          };

          _.set(req, ["error"], payError);
          return next();
        }

        _.set(req, ['body', 'paymentBTC'], result);
        return next();

      });
 
    });    

  }

};