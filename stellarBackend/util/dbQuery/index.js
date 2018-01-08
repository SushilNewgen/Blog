"use strict";

module.exports = {

  "bridge": {
    // fetch queries
    "getPaymentById": "select * from receivedpayment where operation_id = $1"
  },
  "compliance": {

  },
  "federation": {
    // fetch queries
    "getAccount": "select * from accounts where friendly_id = $1",
    "getTransaction": "select TD.id, TD.amount, TD.asset_code, A.friendly_id as memo, TD.payment_time, TD.payment_id from transaction_details TD left join accounts A on TD.user_id = A.id and TD.id between ((select MAX(id) from transaction_details) - $1) and ((select MAX(id) from transaction_details) - $2) order by TD.id desc",
    // update queries
    "addToBankAccountBalance": "insert into transaction_details (user_id, amount, asset_code, payment_time, asset_issuer, from_user, payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  }

};
