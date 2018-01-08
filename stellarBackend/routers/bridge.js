"use strict";

// NPM Modules
const _                           = require('lodash'),
// Stellar Module
      stellarBase                 = require('stellar-base'),
      StellarSdk                  = require('stellar-sdk'),
// Internal Modules
      config                      = require('../config'),
      util                        = require('../util'),
      libs                        = require('../libs'),
      logger                      = config.logger,
      api                         = util.api,
      bridgeConfig                = api.bridge,
      stellarConfig               = util.stellar,
      SCHEMA                      = util.schema,
      REQUEST                     = libs.request,
      DB                          = libs.DB,
      SERVICE                     = libs.service;

StellarSdk.Network.useTestNetwork();

//let server = new StellarSdk.Server('https://staging.globalblockchain.io:8007');
//let server                          = new StellarSdk.Server('https://horizon-testnet.stellar.org');
let server                        = new StellarSdk.Server('https://staging.globalblockchain.io:9000');

// Keys for accounts to issue and receive the new asset
let issuingKeys                   = StellarSdk.Keypair
//  .fromSecret('SBILUHQVXKTLPYXHHBL4IQ7ISJ3AKDTI2ZC56VQ6C2BDMNF463EON65U');
  .fromSecret('SDCWMDQNM2ZOPB4YHQOQLR7LI3UEC36AJ3GGYKGNJNGKTZPFUZZODGO7');

let receivingKeys                 = StellarSdk.Keypair
//  .fromSecret('SAV75E2NK7Q5JZZLBBBNUPCIAKABN64HNHMDLD62SZWM6EBJ4R7CUNTZ');
  .fromSecret('SBL7VD7QZOPR2GQSJIEPJYQAMGCKWOLH4KIFHIJLA3AQYETW2R3PZB4I');

/*
// Create an object to represent the new asset
let astroDollar           = new StellarSdk.Asset('AstroDollar', issuingKeys.publicKey()),
    BTC                   = new StellarSdk.Asset('BTC', issuingKeys.publicKey()),
    USD                   = new StellarSdk.Asset('USD', issuingKeys.publicKey()),
    XAF                   = new StellarSdk.Asset('XAF', issuingKeys.publicKey());
*/
/*
let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
let sourceKeys = StellarSdk.Keypair.fromSecret(
  'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
let destinationId = _.get(stellarConfig, "destinationId", "");
*/

let assets = [];

/*
let validAsset = newCode => {

  let deferred                    = Q.defer();

  server.loadAccount(issuingKeys.publicKey())
  .then( issuer => {

    let balances                  = _.get(issuer, ['balances'], []),
        balancesLength            = balances.length;

    if (balancesLength) {

      for (let object of balances) {
      
        if (_.get(object, ['asset_code'], '') === newCode.toUpperCase()) {
          deferred.resolve(true);
        }

      }

      deferred.resolve(true);

    }

    deferred.resolve(true);

  })
  .catch( err => {

    deferred.reject(err);

  });

  return deferred.promise;

};
*/

module.exports = {

  changeTrust: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      next();
      return ;

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

    let newLimit          = _.get(body, "assetLimit", "1").toString(),
        newCode           = _.get(body, "assetCode", ""),
        // Create an object to represent the new asset;
        newAsset          = new StellarSdk.Asset(newCode, issuingKeys.publicKey());

    // First, the receiving account must trust the asset
    server.loadAccount(receivingKeys.publicKey())
    .then( receiver => {

      _.set(req, ['body', 'receiver'], receiver);
      
      let transaction = new StellarSdk.TransactionBuilder(receiver)
        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        .addOperation(StellarSdk.Operation.changeTrust({
          asset:          newAsset,
          limit:          newLimit
        }))
        .build();

      transaction.sign(receivingKeys);

      _.set(req, ['body', 'receiverTransaction'], transaction);

      return server.submitTransaction(transaction);

    })
    .then( transactionResult => {

      _.set(req, ['body', 'transactionResult'], transactionResult);
      return next();

    })
    .catch( error => {

      let errorTrust = {
        status:           false,
        message:          error,
        statusCode:       400
      };

      logger.error("Error: ".error, JSON.stringify(errorTrust).error);

      _.set(req, "error", errorTrust);
      return next();

    });

  },

  /**
  * createKeys Function
  * Calls staging bridge server API /create-keypair
  * to generate keys
  */
  createKeys: (req, res, next) => {

    let reqOps = {
      url:              _.get(bridgeConfig, 'url', '') + _.get(bridgeConfig, ['createKeys', 'endpoint'], ''),
      method:           _.get(bridgeConfig, ['createKeys', 'method'], 'POST')
    };

    REQUEST.makeRequest(reqOps)
    .then( result => {

      logger.info("Request response: ".info, JSON.stringify(result).info);
      res.status(_.get(result, 'statusCode', 519)).send(result);
      return ;

    })
    .fail( error => {

      logger.error("Error: ".error, JSON.stringify(error).error);
      _.set(req, 'error', error);
      next();

    })
    .done();

  },

  issueAsset: (req, res, next) => {

    let body              = _.get(req, 'body', {});

    let resResult         = {},
        newCode           = _.get(body, "assetCode", "").toUpperCase() ,
        addAmount         = _.get(body, "amount", 0),
        initialBalance    = 0,
        finalBalance      = 0,
        newAsset          = new StellarSdk.Asset(newCode, issuingKeys.publicKey());

    // First, the receiving account initial balance
    server.loadAccount(receivingKeys.publicKey())  
    .then( receiver => {

      let balances            = _.get(receiver, 'balances', []),
          balancesLength      = balances.length;      

      initialBalance          = SERVICE.search(balances, balancesLength, newCode, 'asset_code', 'balance');

      _.set(resResult, 'initialBalance', initialBalance);
      _.set(resResult, 'accountBalance', balances);

      // Second, the issuing account actually sends a payment using the asset
      return server.loadAccount(issuingKeys.publicKey());

    })
    .then( issuer => {

      _.set(resResult, 'issuer', issuer);

      let transaction = new StellarSdk.TransactionBuilder(issuer)
        .addOperation(StellarSdk.Operation.payment({
          destination:    receivingKeys.publicKey(),
          asset:          newAsset,
          amount:         addAmount
        }))
        .build();

      transaction.sign(issuingKeys);

      _.set(resResult, 'issuerTransaction', transaction);

      return server.submitTransaction(transaction);

    })
    .then( issueTransaction => {

      _.set(resResult, 'issueTransaction', issueTransaction);

      // Third, the receiving account balance after transaction
      return server.loadAccount(receivingKeys.publicKey());

    })
    .then( receiver => {

      let balances              = _.get(receiver, 'balances', []),
          balancesLength        = balances.length;      

      finalBalance              = SERVICE.search(balances, balancesLength, newCode, 'asset_code', 'balance');

      _.set(resResult, 'finalBalance', finalBalance);
      _.set(resResult, 'accountFinalBalance', balances);

      let finalResult = {
        status:                 true,
        message:                resResult,
        statusCode:             200
      };

      res.status(200).send(finalResult);

      return ;

    })
    .catch( error => {

      let errorIssuing = {
        status:           false,
        message:          error,
        statusCode:       400
      };

      logger.error("Error: ".error, JSON.stringify(errorIssuing).error);

      _.set(req, "error", errorIssuing);
      next();

      return;
      //res.status(400).send(error);

    });

  },

  issuer: (req, res, next) => {

    let body              = _.get(req, 'body', {});

    /*server.loadAccount(sourceKeys.publicKey())
    .then(function(sourceAccount) {
      console.log("\n\n\n\n", sourceAccount);
      let transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.payment({
          destination: destinationId,
          asset: new StellarSdk.Asset(
            _.get(stellarConfig, "assetCode", ""), _.get(stellarConfig, "assetIssuer", "")),
          amount: _.get(body, 'amount', 1)
        }))
        // Use the memo to indicate the customer this payment is intended for.
        .addMemo(StellarSdk.Memo.text('Amy'))
        .build();
      transaction.sign(sourceKeys);
      return server.submitTransaction(transaction);
    })
    .then(function(result) {
      console.log('Success! Results:', result);
      res.status(200).send(result);
      return ;
    })
    .catch(function(error) {
      console.error('Something went wrong!', error);
      res.status(400).send(error);
      return ;
    });*/

    let resResult         = {},
        newLimit          = _.get(body, "assetLimit", 0),
        newCode           = _.get(body, "assetCode", "").toUpperCase() ,
        addAmount         = _.get(body, "amount", 0),
        newAsset          = new StellarSdk.Asset(newCode, issuingKeys.publicKey());

    // First, the receiving account must trust the asset
    server.loadAccount(receivingKeys.publicKey())
    .then( receiver => {

      _.set(resResult, 'receiver', receiver);
      
      let transaction = new StellarSdk.TransactionBuilder(receiver)
        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        .addOperation(StellarSdk.Operation.changeTrust({
          asset:          newAsset,
          limit:          newLimit
        }))
        .build();

      transaction.sign(receivingKeys);

      _.set(resResult, 'receiverTransaction', transaction);

      return server.submitTransaction(transaction);

    })
    // Second, the issuing account actually sends a payment using the asset
    .then( () => {

      return server.loadAccount(issuingKeys.publicKey());

    })
    .then( issuer => {

      _.set(resResult, 'issuer', issuer);

      let transaction = new StellarSdk.TransactionBuilder(issuer)
        .addOperation(StellarSdk.Operation.payment({
          destination:    receivingKeys.publicKey(),
          asset:          newAsset,
          amount:         addAmount
        }))
        .build();

      transaction.sign(issuingKeys);

      _.set(resResult, 'issuerTransaction', transaction);

      //      res.status(200).send(resResult);

      return server.submitTransaction(transaction);

    })
    .then( issueTransaction => {

      _.set(resResult, 'issueTransaction', issueTransaction);

      let finalResult = {
        status:           true,
        message:          resResult,
        statusCode:       200
      };

      res.status(200).send(finalResult);

    })
    .catch( error => {

      let errorIssuing = {
        status:           false,
        message:          error,
        statusCode:       400
      };

      logger.error("Error: ".error, JSON.stringify(errorIssuing).error);

      _.set(req, "error", errorIssuing);
      next();

      return;
      //res.status(400).send(error);

    });

  },

  payment: (req, res, next) => {

    if (_.get(req, ['error', 'status'], false)) {

      return next();

    }

    let body                  = _.get(req, 'body', {}),
        schema                = _.get(SCHEMA, 'payment', {});

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

    let reqOps = {
      url:                    _.get(bridgeConfig, 'url', '') + _.get(bridgeConfig, ['payment', 'endpoint'], ''),
      method:                 _.get(bridgeConfig, ['payment', 'method'], 'POST'),
      headers:                _.get(bridgeConfig, ['payment', 'headers'], {}),
      form: {
        amount:               _.get(body, 'amount', 1),
        asset_code:           _.get(body, "assetCode", ""),
        memo:                 _.get(body, "memo", "test_navin"),
        memo_type:            _.get(stellarConfig, "memo_type", "text"),
        asset_issuer:         _.get(stellarConfig, "assetIssuer", ""),
        destination:          _.get(stellarConfig, "destination", ""),
        source:               _.get(stellarConfig, "source", "")
      }
    };

    REQUEST.makeRequest(reqOps)
    .then( result => {

      logger.info("Request response: ".info, JSON.stringify(result).info);

      let response            = _.get(result, ['result'], {}),
          statusCode          = _.get(result, ['statusCode'], 509);

      if (_.get(response, ['hash'], null)) {

        _.set(req, ['body', 'payment'], response);
        return next();

      } else {
        
        let paymentError = {
          status:             true,
          error:              response,
          statusCode:         statusCode
        };

        _.set(req, ['error'], paymentError);
        return next();
      }

    })
    .fail( error => {

      let requestError = {
        status:                 true,
        error:                  _.get(error, ['message'], "Error while making call"),
        statusCode:             _.get(error, ['statusCode'], 509)
      };

      logger.error("Error: ".error, JSON.stringify(requestError).error);
      _.set(req, 'error', requestError);
      return next();

    })
    .done();

  },

  receive: (req, res) => {

    let payment                 = _.get(req, ['body'], {}),
        paymentId               = _.get(payment, ['id'], ''),
        paymentMemo             = _.get(payment, ['memo'], '');

    /*
    * `receive` may be called multiple times for the same payment,
    * so checking that payment haven't already been in DB.
    */
    DB.getPaymentById( paymentId )
    .then( paymentDetail => {

      if (_.get(paymentDetail, ['rowCount'], 0)) {
        res.status(200).end();
      }

      /*
      * Because we have one Stellar account representing many customers,
      * the customer the payment is intended for should be in the transaction memo.
      */
      return DB.getAccount( paymentMemo );

    })
    .then( customer => {

      /*
      * For Future
      * Need to check the asset code and issuer to make sure it's an asset
      * that can accept payment to this account for. In this example, we just
      * convert the amount to USD and adding the equivalent amount to the customer
      * balance. Need to implement `convertToUsd()`.
      */
      /*
      * let dollarAmount = convertToUsd(payment.amount, payment.asset_code, payment.asset_issuer);
      */

      _.set(payment, ['userID'], _.get(customer, ['rows', 0, 'id'], 0));

      return DB.addToBankAccountBalance( payment );
  
    })
    .then ( addedDetail => {
      logger.info("DB insertion response: ", addedDetail);
      return res.status(200).end();
    })
    .catch( err => {
      return next();
    });

  },

  getTransaction: (req, res, next) => {

    let body          = _.get(req, 'query', {});

    let transaction = {};

    server.transactions()
    .forAccount(body.accountId)
    .call()
    .then( page => {
        console.log('Page 1: ');
        console.log(page.records);
        _.set(transaction, 'page1', page.records);
        return page.next();
    })
    .then( page => {
        console.log('Page 2: ');
        console.log(page.records);
        _.set(transaction, 'page2', page.records);
        res.send(transaction);
    })
    .catch( err => {
        console.log(err);
        next();
    });

  },

  getAddress: (req, res, next) => {

    /*
      API Call for get userID or Address
    */

    let resResult = {
      status: true,
      result: {
        address:          _.get(stellarConfig, "assetIssuer", ""),
        receiver:         _.get(stellarConfig, "receiver", ""),
        issuer:           _.get(stellarConfig, "assetIssuer", "")
      },
      statusCode: 200
    };

    logger.info("Response: ".info, JSON.stringify(resResult).info);
    res.status(200).send(resResult);
    return ;

  },

  createAsset: (req, res, next) => {

    /*
    * API call for create asset
    let reqOps = {
      url:          _.get(bridgeConfig, 'url', '') + _.get(bridgeConfig, ['createAsset', 'endpoint'], ''),
      method:       _.get(bridgeConfig, ['createAsset', 'method'], 'POST'),
      headers:      _.get(bridgeConfig, ['createAsset', 'headers'], {}),
      form: {
        amount: _.get(req, ['body', 'amount'], 0),
        asset_code: _.get(req, ['body', 'assetCode'], ''),
        asset_issuer: _.get(req, ['body', 'address'], '')
      }
    };

    REQUEST.makeRequest(reqOps)
    .then( function (result) {
      logger.info("Request response: ".info, JSON.stringify(result).info);
      res.status(_.get(result, 'statusCode', 519)).send(result);
      return ;
    })
    .fail( function (error) {
      logger.error("Error: ".error, JSON.stringify(error).error);
      _.set(req, 'error', error);
      next();
    })
    .done();
    */
    let resResult = {
      status:           true,
      result: {
        address:        _.get(req, ['body', 'address'], ''),
        assetCode:      _.get(req, ['body', 'assetCode'], ''),
        amount:         _.get(req, ['body', 'amount'], 0)
      },
      statusCode:       200
    };

    assets.push(resResult.result);
    res.status(200).send(resResult);
    return ;
  },

  getAssets: (req, res, next) => {

    let resResult = {
      status: true,
      result: assets,
      statusCode: 200
    };

    res.status(200).send(resResult);
    return ;
  }

};