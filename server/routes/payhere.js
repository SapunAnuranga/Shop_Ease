const express = require("express");
const crypto = require("crypto");
const router = express.Router();

// Payment init route
router.post("/pay", (req, res) => {
  const { order_id, items, amount, currency, customer } = req.body;

  const hash = crypto
    .createHash("md5")
    .update(
      process.env.PAYHERE_MERCHANT_ID +
        order_id +
        amount +
        currency +
        process.env.PAYHERE_MERCHANT_SECRET
    )
    .digest("hex")
    .toUpperCase();

  res.json({
    merchant_id: process.env.PAYHERE_MERCHANT_ID,
    return_url: process.env.PAYHERE_RETURN_URL,
    cancel_url: process.env.PAYHERE_CANCEL_URL,
    notify_url: process.env.PAYHERE_IPN_URL,
    order_id,
    items,
    amount,
    currency,
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    country: customer.country,
    hash,
  });
});

// IPN handler
router.post("/ipn", (req, res) => {
  console.log("📩 PayHere IPN received:", req.body);

  // TODO: verify hash and update order in DB
  res.status(200).send("IPN received");
});

module.exports = router;
