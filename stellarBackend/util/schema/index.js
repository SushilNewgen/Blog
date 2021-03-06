"use strict";

module.exports = {

  "changeTrust": {
    "type":                           "object",
    "properties": {
      "assetCode": {
        "type":                       "string",
        "minLength":                  1,
        "required":                   true
      },
      "assetLimit": {
        "type":                       "string",
        "pattern":                    /^[0-9.]+$/,
        "required":                   true
      }
    }
  },
  "payment": {
    "type":                           "object",
    "properties": {
      "amount": {
        "type":                       "string",
        "pattern":                    /^[0-9.]+$/,
        "required":                   true
      },
      "assetCode": {
        "type":                       "string",
        "minLength":                  1,
        "required":                   true
      },
      "memo": {
        "type":                       "string",
        "minLength":                  3,
        "required":                   true
      }
    }
  },
  "receiverAddress": {
    "type":                           "object",
    "properties": {
      "amount": {
        "type":                       "string",
        "pattern":                    /^[0-9.]+$/,
        "required":                   true
      },
      "receiverAddress": {
        "type":                       "string",
        "required":                   true
      }
    }
  },
  "transactions": {
    "type":                           "string",
    "pattern":                        /^[0-9]+$/,
    "required":                       true
  }

};