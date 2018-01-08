"use strict";

// NPM Modules
const bodyParser                          = require('body-parser'),
      cors                                = require('cors'),
      express                             = require('express'),
      fs                                  = require('fs'),
      https                               = require('https'),
// Internal Modules
      config                              = require('./config'),
      color                               = config.color,
      logger                              = config.logger,
      router                              = require('./routers');

const app                                 = express();

// Server details
const certificate                         = fs.readFileSync('encrypt/server.crt', 'utf8'),
      privateKey                          = fs.readFileSync('encrypt/server.key', 'utf8'),
      credentials                         = {
          cert:                           certificate,
          key:                            privateKey
      },
      hostname                            = '127.0.0.1',
      httpsServer                         = https.createServer(credentials, app),
      port                                = 4000,
      securePort                          = 1600;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Whitelist all websites using cors
app.use(cors());
/*
// Add headers
app.use(function (req, res) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');//'http://localhost:3000');

  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', false);

});
*/

// Using router for channel routing
router(app);

// Starting secure server over 1600
httpsServer.listen(securePort);

// Starting public server over 4000
app.listen(port);

logger.info("Public server started over ".info + hostname + " port ".info + port);

logger.info("Secure server started over ".warn + hostname + " port ".warn + securePort);
