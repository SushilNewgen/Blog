"use strict";

// NPM Module
const _                                 = require('lodash'),
      JSONvalidator                     = require('json-validation');

let JV = new JSONvalidator.JSONValidation();

class service {

  constructor () {
    // For Future
  }

  /**
  * Search is used for array search using naive approach
  * This can perform three types of search
  * 1. Array Search
  * 2. Array of JSON, object search
  * 3. Array of JSON, object key-value
  *
  * Arguments -
  * 1. arr  ---- Array
  * 2. length   ----  Array length
  * 3. value  ----  to search for
  * 4. key  ----  Key of Object with value
  * 5. keyValue  ---- Key-value which is needed in respect of object with key
  */
  search (arr, length, value, key, keyValue) {

    if (length) {

      /*
      * Third type of search
      */
      if (key && keyValue) {
        for (let object of arr) {
          
          if (_.get(object, [key], '') === value) {
            return _.get(object, [keyValue], 0);
          }

        }
      }
      /*
      * Second type of search
      */
      else if (key) {
        for (let object of arr) {
          
          if (_.get(object, [key], '') === value) {
            return object;
          }

        }
      }
      /*
      * First type of search
      */
      else {
        for (let i = 0; i < length; i++) {

          if (_.get(arr, [i], '') === value) {
            return i;
          }

        }
      }

    }

    return false;

  }

  /**
  * validate is used to check input against its schema
  * Arguments -
  * object  ---- An onject can be JSON, Array, string, number and other JS object
  * schema  ---- Object Schema for help follow https://www.npmjs.com/package/json-validation
  */
  validate (object, schema) {

    return JV.validate(object, schema);

  }

}

let SERVICE = new service();

module.exports = SERVICE;
