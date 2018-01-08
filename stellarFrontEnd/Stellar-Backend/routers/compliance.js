"use strict";

// NPM Modules
const _                           = require('lodash'),
// Internal Modules
      config                      = require('../config'),
      libs                        = require('../libs'),
      util                        = require('../util'),
      logger                      = config.logger,
      api                         = util.api,
      federationConfig            = api.federation,
      REQUEST                     = libs.request;

module.exports = {

  askUser: (req, res, next) => {

    /*var sender = JSON.parse(req.body.sender);

    // You can do any checks that make sense here. For example, you may not
    // want to share information with someone who has sanctions as above:
    sanctionsDatabase.isAllowed(sender)
    .then(function() {
      res.status(200).end();
    })
    .catch(function(error) {
      if (error.type === 'UNKNOWN') {
        // If you need to wait and perform manual checks, you'll have to
        // create a way to do that as well.
        notifyHumanForManualInformationSharing(sender);
        // The value for `pending` is a time to check back again in seconds
        res.status(202).json({pending: 3600}).end();
      }
      else {
        res.status(403).end();
      }
    });*/
    res.status(200).send();
    return ;

  },

  fetchInfo: (req, res, next) => {
    
    let addressParts              = _.get(req, ['body', 'address'], 'tunde_adebayo*staging.globalblockchain.io');
        addressParts              = addressParts.split("*");

    let friendlyId                = addressParts[0];

    // You need to create `accountDatabase.findByFriendlyId()`. It should look
    // up a customer by their Stellar account and return account information.
    /*accountDatabase.findByFriendlyId(friendlyId)
    .then(function(account) {
      // This can be any data you determine is useful and is not limited to
      // these three fields.
      var response = {
        name: account.fullName,
        address: account.address,
        date_of_birth: account.dateOfBirth
      };
      
      res.status(200).send(response).end();
    })
    .catch(function(error) {
      logger.error('Fetch Info Error:', error);
      res.status(500).end(error.message);
    });*/

    let reqOps = {
      url:                        _.get(federationConfig, 'url', '') + _.get(federationConfig, ['fetchInfo', 'endpoint'], ''),
      method:                     _.get(federationConfig, ['fetchInfo', 'method'], 'GET'),
      qs: {
        "q":                      friendlyId + "*staging.globalblockchain.io",
        "type":                   "name"
      }
    };

    REQUEST.makeRequest(reqOps)
    .then( result => {
    
      logger.info("Request response: ".info, JSON.stringify(result).info);

      let resResult = {
        name:                     _.get(result, ['result', 'memo']),
        address:                  _.get(result, ['result', 'account_id']),
        date_of_birth:            "01/04/1965"
      };

      res.status(_.get(result, 'statusCode', 519)).send(resResult);
      return ;
    
    })
    .fail( error => {
      _.set(req, 'error', error);
      next();
    })
    .done();

  },

  sanctions: (req, res, next) => {

    //var sender = JSON.parse(req.body.sender);

    // You need to create a function to check whether there are any sanctions
    // against someone.
    /*sanctionsDatabase.isAllowed(sender)
    .then(function() {
      res.status(200).end();
    })
    .catch(function(error) {
      // In this example, we're assuming `isAllowed` returns an error with a
      // `type` property that indicates the kind of error. Your systems may
      // work differently; just return the same HTTP status codes.
      if (error.type === 'DENIED') {
        res.status(403).end();
      }
      else if (error.type === 'UNKNOWN') {
        // If you need to wait and perform manual checks, you'll have to
        // create a way to do that as well
        notifyHumanForManualSanctionsCheck(sender);
        // The value for `pending` is a time to check back again in seconds
        res.status(202).json({pending: 3600}).end();
      }
      else {
        res.status(500).end(error.message);
      }
      res.status(200).end();
      return ;
    });*/
    
    res.status(200).end();
    return ;

  }

};