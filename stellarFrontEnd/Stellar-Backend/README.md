# stellarBackend

### What is the idea behind this?
Provide APIs for Communication with Stellar SDK, Horizon, Bridge Server, Compliance Server and Federation Server.
User can create Trust, View Transactions and Redeem payments.

Database used is Postgres SQL and its docs can be found over
https://www.postgresql.org/docs/.

To understand Bridge, Federation and Compliance serve follow
https://www.stellar.org/developers/guides/anchor/index.html.

To unserstand and use Stellar SDK follow 
https://github.com/stellar/js-stellar-sdk.

To understand and setup Horizon follow
https://github.com/stellar/docker-stellar-core-horizon.

Server will be created on a secure and public network.

### Before you proceed
Create directory "logger" on root using
```
        mkdir logger
```
This directory will be used for maintaining logs over server/
* To view logs use following command from root
```
        tail -f logger/server.log
```
        or
```
        tail -f logger/*.log
```

* To start server first need to install NPM Modules.
Use following command from root to install from package.json
```
        npm install
```

* To start application use.
```
        node app / node app.js / nodejs app / nodejs app.js
```
        or
```
        npm start / npm run-script start
```

### Application will start over Two ports.
# For secure server 1600 port is used.
# For public server 4000 port is used.



### Application Tree.
```
├─ 1. README.md
├─ 2. app.js
├─ 3. package.json
├─ 4. .gitignore
├─ 5. config
│   ├─ 1. color.js
│   ├─ 2. dbConnection.js
│   ├─ 3. index.js
│   └─ 4. logger.js
│
├─ 6. encrypt
│   ├─ 1. server.crt
│   └─ 2. server.key
│
├─ 7. libs
│   ├─ 1. db.js
│   ├─ 2. index.js
│   ├─ 3. request.js
│   ├─ 4. service.js
│   └─ 5. stellarServer.js
│
├─ 8. logger
│   └─ server.log
│
├─ 9. routers
│   ├─ 1. blocktrail.js
│   ├─ 2. bridge.js
│   ├─ 3. compliance.js
│   ├─ 4. error.js
│   ├─ 5. federation.js
│   ├─ 6. index.js
│   ├─ 7. response.js
│   └─ 8. stellar.js
│
└─ 10. util
    ├─ 1. api
    │   ├─ 1. bridge
    │   │   └─ index.js 
    │   ├─ 2. compliance
    │   │   └─ index.js
    │   ├─ 3. federation
    │   │   └─ index.js
    │   └─ 4. index.js
    ├─ 2. appConst
    │   └─ index.js
    ├─ 3. dbQuery
    │   └─ index.js
    ├─ 4. schema
    │   └─ index.js
    ├─ 5. stellar
    │   └─ index.js
    └─ 6. index.js

```

### Where's everything?
# app.js
Is used to create server (public & secure), handle POST requests and provide access to other applications.
Uses encrypted server certificate and server key for secure network.
Uses body-parser for handling POST requests.
Uses cors for providing open access to other applications.

# package.json
Is used to run scripts and mentain list of NPM modules being used.

# .gitignore
Is used to ignore dump files from being uploaded to github

# config
Configration of every single additional functionality is defined here.
These may include Data-base connections, loggers...

# encrypt
Contails files for secure network. One should never touch these files.

# libs
Contain centralized services for application.
These services includes data-base calls, third-party api calls, array search, validations, and any other possible functionality which is used more then once or might be used more then once.

# logger
Contain all the logs of request and response from server.

# routers
Almost everything is done from here.
```
        index.js
```
contains all the API and is used as centralized router to direct these API to different functions.

# util
Contain all the constants to be used in application. These contants can be thried-party API info (URL, end-pont, auths, method, headers...), data-base queries to be used by any function, object schemas, horizon server info, stellar server info, issuer keys(public-key, private-key), receiver keys(public-key, private-key), blocktrail server details and anything which we want to be constant in our application like ports.


### Heart API of application
1. POST: `/v1/bridge/payment`. This api call functions `stellar.apiInfo`, `bridge.payment`, `blocktrail.transfer`, `bridge.updatePayments`, `response`, `error`. `stellar.apiInfo` is used to print logs which include API and its params. `bridge.payment` is used to call bridge server `payment` API. `blocktrail.transfer` is used to make transaction of BTC to receiver address. `bridge.updatePayments` is used to update a table `payments` in `stellar_bridge` data-base. `response` function is used to send response back with success status. `error` is used to send back any error occured in any previous function.

