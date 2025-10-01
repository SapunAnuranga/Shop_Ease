const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Verify MD5 from PayHere notify
const verifyPayHereMd5 = (body, merchantSecret) => {
  try {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = body;

    // Create MD5 hash of merchant secret
    const merchantSecretHash = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // Concatenate string according to PayHere documentation
    const concatenatedString =
      (merchant_id || '') +
      (order_id || '') +
      (payhere_amount || '') +
      (payhere_currency || '') +
      (status_code || '') +
      merchantSecretHash;

    const localMd5 = crypto
      .createHash("md5")
      .update(concatenatedString)
      .digest("hex")
      .toUpperCase();

    return localMd5 === (md5sig || '').toUpperCase();
  } catch (err) {
    console.error("MD5 verification error:", err);
    return false;
  }
};

// ✅ Create new order and generate PayHere payment object
router.post("/create", async (req, res) => {
  try {
    const { userId, items = [], subtotal = 0, discount = 0, shipping = 0, customerInfo = {} } = req.body;

    if (!items.length) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    const totalAmount = Number(subtotal) - Number(discount) + Number(shipping);
    if (totalAmount <= 0) return res.status(400).json({ success: false, message: "Invalid total amount" });

    // Save order in DB
    const order = new Order({
      userId: userId || null,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shipping: Number(shipping),
      total: totalAmount,
      paymentStatus: "pending",
      orderStatus: "created",
      customerInfo
    });
    await order.save();

    // PayHere payment object
    const payment = {
      sandbox: true,
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: process.env.PAYHERE_RETURN_URL,
      cancel_url: process.env.PAYHERE_CANCEL_URL,
      notify_url: `${process.env.BASE_URL}/api/orders/payhere-notify`,
      order_id: order._id.toString(),
      items: `Order #${order._id.toString().substring(0, 8)}`,
      amount: totalAmount.toFixed(2),
      currency: "LKR",
      first_name: customerInfo.first_name || "Customer",
      last_name: customerInfo.last_name || "",
      email: customerInfo.email || "customer@example.com",
      phone: customerInfo.phone || "0771234567",
      address: customerInfo.address || "No. 1, Galle Road",
      city: customerInfo.city || "Colombo",
      country: "Sri Lanka"
    };

    // ✅ Generate correct hash
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) return res.status(500).json({ success: false, message: "Payment configuration error" });

    const merchantSecretHash = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const hashString = payment.merchant_id + payment.order_id + payment.amount + payment.currency + merchantSecretHash;

    payment.hash = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();

    console.log("💰 Payment object:", payment);

    res.json({ success: true, payment, orderId: order._id });

  } catch (err) {
    console.error("❌ Order create error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// ✅ PayHere notify endpoint
router.post("/payhere-notify", async (req, res) => {
  try {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!verifyPayHereMd5(req.body, merchantSecret)) {
      console.error("❌ Invalid MD5 signature");
      return res.status(400).send("Invalid signature");
    }

    const { order_id, status_code, payment_id, payhere_amount } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).send("Order not found");

    const statusMap = {
      2: { paymentStatus: "paid", orderStatus: "processing" },
      0: { paymentStatus: "pending", orderStatus: "created" },
      "-1": { paymentStatus: "cancelled", orderStatus: "cancelled" },
      "-2": { paymentStatus: "failed", orderStatus: "cancelled" },
      "-3": { paymentStatus: "charged_back", orderStatus: "cancelled" }
    };

    const newStatus = statusMap[status_code] || { paymentStatus: "failed", orderStatus: "cancelled" };

    order.paymentStatus = newStatus.paymentStatus;
    order.orderStatus = newStatus.orderStatus;
    order.payherePaymentId = payment_id;
    if (payhere_amount) order.actualPaidAmount = parseFloat(payhere_amount);

    await order.save();
    console.log("✅ Order updated:", order_id, order.paymentStatus);

    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ Notify error:", err);
    res.status(200).send("OK"); // always return 200 to PayHere
  }
});

module.exports = router;
