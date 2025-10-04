// routes/orders.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Order = require("../models/Order");

// ---------- Helpers ----------

// Verify MD5 signature sent by PayHere (IPN / notify)
const verifyPayHereMd5 = (body, merchantSecret) => {
  try {
    const {
      merchant_id = "",
      order_id = "",
      payhere_amount = "",
      payhere_currency = "",
      status_code = "",
      md5sig = "",
    } = body || {};

    // PayHere requires merchant secret hashed with MD5 first (uppercase hex)
    const merchantSecretHash = crypto
      .createHash("md5")
      .update(String(merchantSecret || ""))
      .digest("hex")
      .toUpperCase();

    const concatenatedString =
      String(merchant_id) +
      String(order_id) +
      String(payhere_amount) +
      String(payhere_currency) +
      String(status_code) +
      merchantSecretHash;

    const localMd5 = crypto
      .createHash("md5")
      .update(concatenatedString)
      .digest("hex")
      .toUpperCase();

    // compare uppercase hex values
    return localMd5 === String(md5sig || "").toUpperCase();
  } catch (err) {
    console.error("MD5 verification error:", err);
    return false;
  }
};

// ---------- Create Order & Build PayHere Payment Object ----------
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      items = [],
      subtotal = 0,
      discount = 0,
      shipping = 0,
      customerInfo = {},
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart items are required" });
    }

    const totalAmount = Number(subtotal) - Number(discount) + Number(shipping);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid total amount" });
    }

    const order = new Order({
      userId: userId || null,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shipping: Number(shipping),
      total: totalAmount,
      paymentStatus: "pending",
      orderStatus: "created",
      customerInfo,
      createdAt: new Date(),
    });

    await order.save();

    const isSandbox = process.env.NODE_ENV !== "production";

    // Ensure notify_url uses the same route this router uses when mounted:
    // e.g., if this router is mounted at /api/orders then notify_url should be `${BASE_URL}/api/orders/payhere-notify`
    const notifyUrl = `${process.env.BASE_URL.replace(/\/$/, "")}/api/orders/payhere-notify`;

    const payment = {
      sandbox: !!isSandbox,
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: process.env.PAYHERE_RETURN_URL,
      cancel_url: process.env.PAYHERE_CANCEL_URL,
      notify_url: notifyUrl,
      order_id: order._id.toString(),
      items: `Order #${order._id.toString().substring(0, 8)}`,
      amount: Number(totalAmount).toFixed(2),
      currency: "LKR",
      first_name: customerInfo.first_name || "Customer",
      last_name: customerInfo.last_name || "",
      email: customerInfo.email || "customer@example.com",
      phone: customerInfo.phone || "0771234567",
      address: customerInfo.address || "No. 1, Galle Road",
      city: customerInfo.city || "Colombo",
      country: "Sri Lanka",
    };

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      console.error("PAYHERE_MERCHANT_SECRET not configured");
      return res
        .status(500)
        .json({ success: false, message: "Payment configuration error" });
    }

    // PayHere requires: md5( merchant_id + order_id + payhere_amount + payhere_currency + md5(merchant_secret) )
    const merchantSecretHash = crypto
      .createHash("md5")
      .update(String(merchantSecret))
      .digest("hex")
      .toUpperCase();

    const hashString =
      String(payment.merchant_id) +
      String(payment.order_id) +
      String(payment.amount) +
      String(payment.currency) +
      merchantSecretHash;

    payment.hash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    console.log("💰 Payment object:", {
      ...payment,
      // avoid printing sensitive hashes in production logs — mask them if needed
      hash: payment.hash ? `${payment.hash.substring(0, 6)}...masked` : null,
    });

    return res.json({ success: true, payment, orderId: order._id });
  } catch (err) {
    console.error("❌ Order create error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Order creation failed" });
  }
});

// ---------- PayHere notify endpoint (IPN) ----------
router.post("/payhere-notify", async (req, res) => {
  try {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      console.error("PAYHERE_MERCHANT_SECRET not set, cannot verify IPN");
      // respond 200 to avoid retries, but this should be monitored/alerted
      return res.status(200).send("OK");
    }

    // Important: ensure your Express app uses urlencoded parser for PayHere (form data)
    // app.use(express.urlencoded({ extended: true }));
    // PayHere sends content-type: application/x-www-form-urlencoded

    if (!verifyPayHereMd5(req.body, merchantSecret)) {
      console.error("❌ Invalid MD5 signature from PayHere:", req.body);
      // respond 400 to indicate invalid signature
      return res.status(400).send("Invalid signature");
    }

    const { order_id, status_code, payment_id, payhere_amount } = req.body;

    // Find order
    const order = await Order.findById(order_id);
    if (!order) {
      console.error("❌ Order not found for notify:", order_id);
      // still return 200 to PayHere to stop continuous retries — but log & monitor
      return res.status(200).send("OK");
    }

    // Map PayHere status codes to your statuses
    // Note: status_code might be string or number — normalize to string
    const code = String(status_code);

    const statusMap = {
      "2": { paymentStatus: "paid", orderStatus: "processing" }, // success
      "0": { paymentStatus: "pending", orderStatus: "created" }, // pending
      "-1": { paymentStatus: "cancelled", orderStatus: "cancelled" },
      "-2": { paymentStatus: "failed", orderStatus: "cancelled" },
      "-3": { paymentStatus: "charged_back", orderStatus: "cancelled" },
    };

    const newStatus = statusMap[code] || {
      paymentStatus: "failed",
      orderStatus: "cancelled",
    };

    order.paymentStatus = newStatus.paymentStatus;
    order.orderStatus = newStatus.orderStatus;
    order.payherePaymentId = payment_id || order.payherePaymentId;
    if (payhere_amount) {
      order.actualPaidAmount = parseFloat(payhere_amount);
    }
    order.updatedAt = new Date();

    await order.save();

    console.log(
      `✅ PayHere notify processed. order=${order_id} status=${order.paymentStatus} payment_id=${payment_id}`
    );

    // PayHere expects 200 OK — send it
    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Notify error:", err);
    // Return 200 so PayHere doesn't keep retrying excessively; logs will contain the error.
    return res.status(200).send("OK");
  }
});

// ---------- Public order fetch (for success page) ----------
router.get("/public/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Only expose if paid
    if (order.paymentStatus !== "paid") {
      return res
        .status(403)
        .json({ success: false, message: "Order not paid yet" });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Public order fetch error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

module.exports = router;
