"use strict";

/*
* File is used to store Bridge Server API
* URL of Bridge Server
* Service provided by Bridge Server
*/

module.exports = {

  "url": "http://staging.globalblockchain.io:8006",
  // Create Keys
  "createKeys": {
    "endpoint": "/create-keypair",
    "method": "POST"
  },
  // Payment request options
  "payment": {
    "endpoint": "/payment",
    "method": "POST",
    "headers": {
      "Content-Type": "multipart/form-data"
    }
  }

};