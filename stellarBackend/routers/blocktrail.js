"use strict";

// NPM Modules
const _                               = require("lodash"),
      blocktrail                      = require("blocktrail-sdk"),
// Internal Modules;
      libs                            = require("../libs"),
      util                            = require("../util"),
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

    let receiverAddress        = _.get(req, ['body', 'receiverAddress'], ''),
        amount                 = _.get(req, ['body', 'amount', 0]);

    //Initialising client with API key and API secret
    let client = blocktrail.BlocktrailSDK({apiKey: "dead7b55049c461caf6fae83d62dc535f9f2892e", apiSecret: "3df6c2ab32af68dfaa2d018e0713ad1c9505fd3b", network: "BTC", testnet: true});

    client.initWallet("sample-identifier", "nikita@02", (err, wallet) => {

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