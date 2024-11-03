const paypal = require("paypal-rest-sdk");
require('dotenv').config();
paypal.configure({
  mode: process.env.MODE,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

module.exports = paypal;
