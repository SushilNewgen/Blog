"use strict";

// NPM Modules
const _                           = require('lodash'),
// Stellar Module
      stellarBase                 = require('stellar-base'),
      StellarSdk                  = require('stellar-sdk'),
// Internal Modules
      config                      = require('../config'),
      lib                         = require('../libs'),
      util                        = require('../util'),
      logger                      = config.logger,
      SCHEMA                      = util.schema,
      SERVICE                     = lib.service,
      stellarConfig               = util.stellar,
      horizon                     = _.get(stellarConfig, ['horizon'], 'https://horizon-testnet.stellar.org'),
      issuerSecretKey             = _.get(stellarConfig, ['source'], ''),
      receivingSecretKey          = _.get(stellarConfig, ['receivingKey'], '');

StellarSdk.Network.useTestNetwork();

//var server = new StellarSdk.Server('https://staging.globalblockchain.io:8007');
//let server                = new StellarSdk.Server('https://horizon-testnet.stellar.org');
let server                        = new StellarSdk.Server(horizon);

// Keys for accounts to issue and receive the new asset
let issuingKeys                   = StellarSdk.Keypair
  .fromSecret( issuerSecretKey );

let receivingKeys                 = StellarSdk.Keypair
  .fromSecret( receivingSecretKey );

/*
// Create an object to represent the new asset
var astroDollar           = new StellarSdk.Asset('AstroDollar', issuingKeys.publicKey()),
    BTC                   = new StellarSdk.Asset('BTC', issuingKeys.publicKey()),
    USD                   = new StellarSdk.Asset('USD', issuingKeys.publicKey()),
    XAF                   = new StellarSdk.Asset('XAF', issuingKeys.publicKey());
*/
/*
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
var sourceKeys = StellarSdk.Keypair.fromSecret(
  'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
var destinationId = _.get(stellarConfig, "destinationId", "");
*/

module.exports = {

  apiInfo: (req, res, next) => {

    const url             = _.get(req, 'url', ''),
          method          = _.get(req, 'method', ''),
          body            = _.get(req, 'body', {}),
          query           = _.get(req, 'query', {});

    logger.info(method + ": " + url);
    logger.info("Params: ".info, JSON.stringify((method === "POST") ? body : query).info);

    next();

  },

  getAssets: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let assets                = _.get(req, ['body', 'receiver', 'balances'], []);

    _.set(req, ['body', 'assets'], assets);
    return next();

  },

  // For Future Use
  /*
  isValidAsset: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      next();
      return ;

    }

    let newCode               = _.get(req, ['body', 'assetCode'], '').toUpperCase(),
        balances              = _.get(req, ['body', 'issuer','balances'], []),
        balancesLength        = balances.length;

    if (balancesLength) {

      for (let object of balances) {
        
        if (_.get(object, ['asset_code'], '') === newCode) {

          _.set(req, ['body', 'assetCode'], newCode);
          _.set(req, ['body', 'isValidAsset'], true);

          next();
          return ;

        }

      }

      let noAssetError = {
        status:               true,
        message:              "Invalid Asset Code",
        statusCode:           204
      };

      _.set(req, ['error'], noAssetError);
      next();
      return ;

    }

    let noIssuerError = {
      status:               true,
      message:              "Issuer got no asset",
      statusCode:           204
    };

    _.set(req, ['error'], noIssuerError);
    next();
    return ;

  },
  */

  receivingKeys: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      next();
      return ;

    }

    server.loadAccount(receivingKeys.publicKey())
    .then( receiver => {

      _.set(req, ['body', 'receiver'], receiver);
      next();
      return ;

    })
    .catch( err => {

      let receiverError = {
        status:               true,
        message:              err || "Error occured while fetching receiver info",
        statusCode:           400
      };

      _.set(req, ["error"], receiverError);
      return next();

    });

  },

  // First, the receiving account must trust the asset
  receiverTransaction: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let body                  = _.get(req, 'body', {}),
        schema                = _.get(SCHEMA, 'changeTrust', {});

    let isValidJSON           = SERVICE.validate(body, schema);

    if ( !_.get(isValidJSON, ["ok"], false) ) {

      let invalidError = {
        status:               true,
        error:                isValidJSON,
        statusCode:           422
      };

      _.set(req, ["error"], invalidError);
      return next();

    }

    let receiver              = _.get(body, ['receiver'], {}),
        assetCode             = _.get(body, ['assetCode'], ''),
        newLimit              = _.get(body, ['assetLimit'], "1").toString(),
        // Create an object to represent the new asset;
        newAsset              = new StellarSdk.Asset(assetCode, issuingKeys.publicKey());

    let transaction           = new StellarSdk.TransactionBuilder(receiver)
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(StellarSdk.Operation.changeTrust({
        asset:                newAsset,
        limit:                newLimit
      }))
      .build();

    transaction.sign(receivingKeys);

    _.set(req, ['body', 'newAsset'], newAsset);
    _.set(req, ['body', 'receiverTransaction'], transaction);
    _.set(req, ['body', 'transaction'], transaction);
    
    return next();

  },

  submitTransaction: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let transaction       = _.get(req, ['body', 'transaction'], {});

    server.submitTransaction(transaction)
    .then( response => {

      _.set(req, ['body', 'transactionResponse'], response);
      return next();

    })
    .catch( err => {

      let transactionError = {
        status:           true,
        message:          err || "Error occured while performing transaction",
        statusCode:       400
      };

      _.set(req, "error", transactionError);
      return next();

    });

  },

  issuingKeys: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    server.loadAccount(issuingKeys.publicKey())
    .then( issuer => {

      _.set(req, ['body', 'issuer'], issuer);
      return next();

    })
    .catch( err => {

      let issuerError = {
        status:           true,
        message:          err || "Error occured while fetching issuer info",
        statusCode:       400
      };

      _.set(req, ["error"], issuerError);
      return next();

    });

  },

  issuerTransaction: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let issuer              = _.get(req, ['body', 'issuer'], {}),
        assetCode           = _.get(req, ['body', 'assetCode'], ''),
        addAmount           = _.get(req, ['body', 'amount'], 0),
        newAsset            = new StellarSdk.Asset(assetCode, issuingKeys.publicKey());

    let transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.payment({
        destination:        receivingKeys.publicKey(),
        asset:              newAsset,
        amount:             addAmount
      }))
      .build();

    transaction.sign(issuingKeys);

    _.set(req, ['body', 'issuerTransaction'], transaction);
    _.set(req, ['body', 'transaction'], transaction);
    return next();

  },

  issueUpdate: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let balances            = _.get(req, ['body', 'receiver', 'balances'], []),
        assetCode           = _.get(req, ['body', 'assetCode'], ''),
        balancesLength      = balances.length,
        initialBalance      = 0,
        finalBalance        = 0; 

    initialBalance          = SERVICE.search(balances, balancesLength, assetCode, 'asset_code', 'balance');

    // Using search service for this
    /*if (balancesLength) {

      for (let i = 0; i<balancesLength; i++) {
        
        if (_.get(balances, [i, 'asset_code'], '') === assetCode) {
          initialBalance    = _.get(balances, [i, 'balance']);
        }

      }
    }*/

    _.set(req, ['body', 'initialBalance'], initialBalance);
    _.set(req, ['body', 'accountBalance'], balances);

    /*
    * Getting Receiver updated info
    */
    server.loadAccount(receivingKeys.publicKey())
    .then( receiver => {

      balances              = _.get(receiver, 'balances', []);
      balancesLength        = balances.length;      

      finalBalance          = SERVICE.search(balances, balancesLength, assetCode, 'asset_code', 'balance');

      // Using search service for this
      /*if (balancesLength) {

        for (let i = 0; i<balancesLength; i++) {
        
          if (_.get(balances, [i, 'asset_code'], '') === assetCode) {
            finalBalance    = _.get(balances, [i, 'balance']);
          }

        }
      }*/

      _.set(req, ['body', 'finalBalance'], finalBalance);
      _.set(req, ['body', 'accountFinalBalance'], balances);

      return next();

    })
    .catch( err => {

      let updateError = {
        status:           true,
        message:          err,
        statusCode:       400
      };

      _.set(req, "error", updateError);
      return next();

    });

  }

};