# stellarBackend

Provide APIs for Communication with Stellar SDK, Horizon, Bridge Server, Compliance Server and Federation Server
User can create Trust, Payment and Redeem payments

Database used is Postgres SQL and its docs can be found over
https://www.postgresql.org/docs/

To understand Bridge, Federation and Compliance serve follow
https://www.stellar.org/developers/guides/anchor/index.html

To unserstand and use Stellar SDK follow 
https://github.com/stellar/js-stellar-sdk

To understand and setup Horizon follow
https://github.com/stellar/docker-stellar-core-horizon

Server will be created on a secure and public network

create directory logger on root using

        mkdir logger

This directory will be used for maintaining logs over server

To start server first need to install NPM Modules
Use following command from root to install from package.json

        npm install

To start application use

        node app / node app.js / nodejs app / nodejs app.js

        or

        npm start / npm run-script start

Using simple-node-logger for logs
All the API are configured in util
