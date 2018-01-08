"use strict";

// NPM Modules
const _                         = require('lodash'),
      MOMENT                    = require('moment'),
      Q                         = require('q'),
// Internal Modules
      config                    = require('../config'),
      util                      = require('../util'),

      DB                        = config.DB,
      bridgeDB                  = DB.bridgeClient,
      complianceDB              = DB.complianceClient,
      federationDB              = DB.federationClient,
      dbQuery                   = util.dbQuery;

module.exports = {

  addToBankAccountBalance: payment => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['federation', 'addToBankAccountBalance'], '');

    let user_id                 = _.get(payment, ['userID'], 0),
        asset_code              = _.get(payment, ['asset_code'], ''),
        asset_issuer            = _.get(payment, ['asset_issuer'], ''),
        from                    = _.get(payment, ['from'], ''),
        payment_id              = _.get(payment, ['id'], ''),
        amount                  = parseInt(_.get(payment, ['amount'], 0)),
        payment_time            = MOMENT().format('DD-MM-YYYY hh:mm:ss');

    federationDB.query(query, [user_id, amount, asset_code, payment_time, asset_issuer, from, payment_id])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  },

  getAccount: memo => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['federation', 'getAccount'], '');

    federationDB.query(query, [memo])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  },

  getPaymentById: id => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['bridge', 'getPaymentById'], '');

    bridgeDB.query(query, [id])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  },

  getPayments: page => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['bridge', 'getPayments'], '');

    let l_limit                 = page * 20,
        u_limit                 = l_limit - 20;

    bridgeDB.query(query, [l_limit, u_limit])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  },

  getTransaction: page => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['federation', 'getTransaction'], '');

    let l_limit                 = page * 20,
        u_limit                 = l_limit - 20;

    federationDB.query(query, [l_limit, u_limit])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  },

  updatePayments: body => {

    let deferred                = Q.defer();

    let query                   = _.get(dbQuery, ['bridge', 'updatePayments'], '');

    let user_id                 = _.get(body, ['memo'], 0),
        amount                  = _.get(body, ['amount'], 0),
        asset_code              = _.get(body, ['assetCode'], ''),
        receiver                = _.get(body, ['address'], ''),
        payment_hash            = _.get(body, ['payment', 'hash'], ''),
        payment_btc             = _.get(body, ['paymentBTC'], ''),
        address_btc             = _.get(body, ['receiverAddress']),
        status_code             = "success",
        payment_time            = MOMENT().format('DD-MM-YYYY hh:mm:ss');

    bridgeDB.query(query, [user_id, amount, asset_code, payment_time, receiver, payment_hash, payment_btc, address_btc, status_code])
    .then( queryRes => {

      deferred.resolve(queryRes);

    })
    .catch( err => {

      deferred.reject(err);

    });

    return deferred.promise;

  }

};
