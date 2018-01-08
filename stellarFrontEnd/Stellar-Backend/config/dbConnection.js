"use strict";

// NPM Modules
const pg                                = require("pg");

const bridge = {
        user:                           'postgres',
        database:                       'stellar_bridge',
        password:                       'staging123',
        port:                           5432,
        max:                            10, // max number of connection can be open to database
        idleTimeoutMillis:              30000, // how long a client is allowed to remain idle before being closed
      },
      
      compliance = {
        user:                           'postgres',
        database:                       'stellar_compliance',
        password:                       'staging123',
        port:                           5432,
        max:                            10, // max number of connection can be open to database
        idleTimeoutMillis:              30000, // how long a client is allowed to remain idle before being closed
      },

      federation = {
        user:                           'postgres',
        database:                       'internal_accounts',
        password:                       'staging123',
        port:                           5432,
        max:                            10, // max number of connection can be open to database
        idleTimeoutMillis:              30000, // how long a client is allowed to remain idle before being closed
      };

const bridgeClient                      = new pg.Pool(bridge),
      complianceClient                  = new pg.Pool(compliance),
      federationClient                  = new pg.Pool(federation);

bridgeClient.connect();
complianceClient.connect();
federationClient.connect();

module.exports = {

  bridgeClient:                         bridgeClient,
  complianceClient:                     complianceClient,
  federationClient:                     federationClient

};
