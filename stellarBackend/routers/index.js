"use strict";

// NPM Modules
const _                   = require('lodash'),
// Internal Modules
      blocktrail          = require('./blocktrail'),
      bridge              = require('./bridge'),
      compliance          = require('./compliance'),
      federation          = require('./federation'),
      stellar             = require('./stellar'),
      response            = require('./response'),
      error               = require('./error');

module.exports = app => {

  /**
  * /v1/bridge/createKeys
  * API is used to creat Public and Private key
  * Currently no input is needed
  * 
  * Sample Success Response
  * {
  *   status: true,
  *   result: {
  *     "public_key": "GAXVVD6YA4QJNTMWZH4V7HYNCSPGNPGG4DGDB3IQ5AGWPGZT64KJTIFF",
  *     "private_key": "SC4UHHSMMFZZ2BED76DH7B7UXC7Q6JEVCXXHWO6HLC3MVHFVMSW63T25"
  *   },
  *   statusCode: 200
  * }
  *
  * Sample Error Response
  * {
  *   status: false,
  *   message: err || "Unknown error",
  *   statusCode: 509
  * }
  */
  app.post('/v1/bridge/createKeys', stellar.apiInfo, bridge.createKeys, error);

  /**
  * POST: /v1/bridge/payment
  * API is used to make payment
  *
  * Sample Request application-json
  * {
  *   "amount": 11,
  *   "assetCode": "BTC",
  *   "memo": "fname_lname"
  * }
  *
  * Sample Success Response
  * {
  *   "status": true,
  *   "message": {
  *     "amount": 11,
  *     "assetCode": "BTC",
  *     "memo": "fname_lname",
  *     "payment": {
  *       "hash": "3457865f066655a23b65ed059e5480a84b0d1f611b439c9f9319d07b30795eb2",
  *       "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
  *       "ledger": 6288880
  *     }
  *   },
  *   "statusCode":200
  * }
  *
  * Sample Error Wrong Argument
  * {
  *   "status": false,
  *   "error": {
  *     "status": true,
  *     "error": {
  *       "ok": false,
  *       "errors": ["Object is missing required property: amount"],
  *       "path":"$root.amount"
  *     },
  *     "statusCode":422
  *   },
  *   "statusCode":422
  * }
  *
  * Sample Error From Bridge Server
  * {
  *   "status": false,
  *   "error": {
  *     "status": true,
  *     "error": {
  *       "code": "source_not_exist",
  *       "message": "Source account does not exist."
  *     },
  *     "statusCode": 400
  *   },
  *   "statusCode": 400
  * }
  *
  * Sample Error From Bridge Server
  * {
  *   "status": false,
  *   "error": {
  *     "status": true,
  *     "error": {
  *       "code": "internal_server_error",
  *       "message": "Internal Server Error, please try again."
  *     },
  *     "statusCode": 500
  *   },
  *   "statusCode": 500
  * }
  *
  * Sample Error From Bridge Server
  * {
  *   "status": false,
  *   "error": {
  *     "status": true,
  *     "error": {
  *       "code": "payment_no_trust",
  *       "message": "Destination missing a trust line for asset."
  *     },
  *     "statusCode": 400
  *   },
  *   "statusCode": 400
  * }
  *
  */
  app.post('/v1/bridge/payment', stellar.apiInfo, bridge.payment, blocktrail.transfer, response, error);

  /**
  * /v1/bridge/receive
  * API is called on success of transaction by bridge server
  * API is used for Database entery
  * Sample Request is application-json
  * {
  *   "amount": "100.0000000",
  *   "asset_code": "BTC",
  *   "asset_issuer": "GA2ZGYXIM3ZPXAURT5LXYSWG7M6NELIDGYU2WJVDB3AGQLUTCORLZBLV",
  *   "data": "",
  *   "from": "GA2ZGYXIM3ZPXAURT5LXYSWG7M6NELIDGYU2WJVDB3AGQLUTCORLZBLV",
  *   "id": "27007647710449665",
  *   "memo": "any*domain",
  *   "memo_type": "text",
  *   "route": "memo_type"
  * }
  */
  app.post('/v1/bridge/receive', stellar.apiInfo, bridge.receive, error);

  /**
  * GET: /v1/federation/getTransaction
  * API is used to get transaction details
  * Sample Request is Query String
  * {
  *   "page": 1            //every page include 20 transactions, page 1 includes last/new transactions
  * }
  */
  app.get('/v1/federation/getTransaction', stellar.apiInfo, federation.getTransaction, response, error);

  app.get('/v1/bridge/getAddress', stellar.apiInfo, bridge.getAddress, error);

  app.post('/v1/bridge/createAsset', stellar.apiInfo, bridge.createAsset, error);

  app.get('/v1/bridge/getAssets', stellar.apiInfo, bridge.getAssets, error);

  app.post('/v1/bridge/issuer', stellar.apiInfo, bridge.issuer, error);

  app.post('/v1/bridge/changeTrust', stellar.apiInfo, bridge.changeTrust, response, error);

  app.post('/v1/bridge/issueAsset', stellar.apiInfo, bridge.issueAsset, error);

  app.get('/v1/bridge/getTransaction', stellar.apiInfo, bridge.getTransaction, error);

  app.post('/compliance/fetch_info', stellar.apiInfo, compliance.fetchInfo, error);

  app.post('/compliance/sanctions', stellar.apiInfo, compliance.sanctions, error);

  app.post('/compliance/ask_user', stellar.apiInfo, compliance.askUser, error);

  app.post('/v1/stellar/issue', stellar.apiInfo, stellar.receivingKeys, stellar.receiverTransaction, stellar.submitTransaction, stellar.issuingKeys, stellar.issuerTransaction, stellar.submitTransaction, stellar.issueUpdate, response, error);

  /**
  * /v1/stellar/changeTrust
  * API is used to make trust and payment using stellar-sdk
  * 
  * Sample Request
  * {
  *   "assetCode": "BTC",       // Currency in which payment will be made
  *   "assetLimit": 100000,     // Limit of currency Receiver can have
  * }
  */
  app.post('/v1/stellar/changeTrust', stellar.apiInfo, stellar.receivingKeys, stellar.receiverTransaction, stellar.submitTransaction, response, error);

  /**
  * GET: /v1/stellar/getAssets
  *
  * Sample Success Response
  * {
  *   "status": true,
  *   "message": {
  *     "assets": [
  *       {
  *         "balance": "160.0000000",
  *         "limit": "10000.0000000",
  *         "asset_type": "credit_alphanum4",
  *         "asset_code": "GOD",
  *         "asset_issuer": "GA2LWEOITZHLFB7BEIVRTAEYK4KYIOJJVMUOKCV7IRND6IDKVU337UMI"
  *       },
  *       {
  *         "balance": "206.0000000",
  *         "limit": "100000.0000000",
  *         "asset_type": "credit_alphanum4",
  *         "asset_code": "USD",
  *         "asset_issuer": "GA2LWEOITZHLFB7BEIVRTAEYK4KYIOJJVMUOKCV7IRND6IDKVU337UMI"
  *       },
  *       {
  *         "balance": "0.0000000",
  *         "limit": "1000.0000000",
  *         "asset_type": "credit_alphanum4",
  *         "asset_code": "BTC",
  *         "asset_issuer": "GA2LWEOITZHLFB7BEIVRTAEYK4KYIOJJVMUOKCV7IRND6IDKVU337UMI"
  *       },
  *       {
  *         "balance": "9999.9999400",
  *         "asset_type": "native"
  *       }
  *     ]
  *   },
  *   "statusCode": 200
  * }
  */
  app.get('/v1/stellar/getAssets', stellar.apiInfo, stellar.receivingKeys, response, error);

  /**
  * /v1/stellar/stellarPayment
  * API is used to make trust and payment using stellar-sdk
  * 
  * Sample Request
  * {
  *   "amount": 100,            // Amount to be made paid
  *   "assetCode": "BTC",       // Currency in which payment will be made
  *   "assetLimit": 100000,     // Limit of currency Receiver can have
  * }
  */
  app.post('/v1/stellar/stellarPayment', stellar.apiInfo, stellar.issuingKeys, stellar.issuerTransaction, stellar.submitTransaction, stellar.receivingKeys, stellar.issueUpdate, response, error);

  /**
  * /v1/stellar/payment
  * API is used to make payment using bridge and get trust
  * 
  * Sample Request
  * {
  *   "amount": 100,            // Amount to be made paid
  *   "assetCode": "BTC",       // Currency in which payment will be made
  *   "assetLimit": "100000",   // Limit of currency Receiver can have
  *   "memo": "saket*fyhrt"     // Memo for transaction
  * }
  * 
  * Sample Success Response
  * {
  *   "status": true,
  *   "message": {
  *     "amount": 100,
  *     "assetCode": "BTC",
  *     "assetLimit": 100000,
  *     "memo": "saket*fyhrt",
  *     "payment": {
  *       "hash": "3457865f066655a23b65ed059e5480a84b0d1f611b439c9f9319d07b30795eb2",
  *       "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
  *       "ledger": 6288880
  *     }
  *   },
  *   "statusCode": 200
  * }
  *
  * Sample Error Response
  * {
  *   "status": false,
  *   "error": {
  *     "status": true,
  *     "error": {
  *       "code": "payment_no_trust",
  *       "message": "Destination missing a trust line for asset."
  *     },
  *     "statusCode": 400
  *   },
  *   "statusCode": 400
  * }
  */
  app.post('/v1/stellar/payment', stellar.apiInfo, stellar.receivingKeys, stellar.receiverTransaction, stellar.submitTransaction, bridge.payment, response, error);

  app.post('/error', (req, res, next) => {
    _.set(req, 'error', req.body);

    next();
  }, error);

};