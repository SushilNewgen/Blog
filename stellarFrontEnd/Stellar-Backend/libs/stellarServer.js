"use strict";

// NPM Modules
const _                   = require('lodash'),
// Stellar Module
      stellarBase         = require('stellar-base'),
      StellarSdk          = require('stellar-sdk');

StellarSdk.Network.useTestNetwork();

//let server = new StellarSdk.Server('https://staging.globalblockchain.io:8007');
//let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
let server                = new StellarSdk.Server('https://staging.globalblockchain.io:9000');

// Keys for accounts to issue and receive the new asset
let issuingKeys           = StellarSdk.Keypair
  .fromSecret('SBILUHQVXKTLPYXHHBL4IQ7ISJ3AKDTI2ZC56VQ6C2BDMNF463EON65U');
let receivingKeys         = StellarSdk.Keypair
  .fromSecret('SAV75E2NK7Q5JZZLBBBNUPCIAKABN64HNHMDLD62SZWM6EBJ4R7CUNTZ');

function stellar() {

  const self = this;

}

stellar.prototype.issuerDetails = function() {

  return server.loadAccount(issuingKeys.publicKey());

};

stellar.prototype.validAsset = function(newCode) {

  let issuer = self.issuerDetails();

  return ;

};

module.exports = stellar;