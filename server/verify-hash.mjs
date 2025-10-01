import dotenv from "dotenv";
import crypto from "crypto";

// Load .env variables
dotenv.config();

// 👇 Replace these test values with the exact ones you used in a payment request
const merchant_id = process.env.PAYHERE_MERCHANT_ID;       // from .env
const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET; // from .env
const order_id = "ORDER123";      // same as backend sent
const amount = "270000.00";       // must be 2 decimal places
const currency = "LKR";

// Step 1: Hash merchant_secret
const secretHash = crypto
  .createHash("md5")
  .update(merchant_secret)
  .digest("hex")
  .toUpperCase();

// Step 2: Build hash string
const hashString = merchant_id + order_id + amount + currency + secretHash;

// Step 3: Generate final hash
const finalHash = crypto
  .createHash("md5")
  .update(hashString)
  .digest("hex")
  .toUpperCase();

console.log("Merchant ID:", merchant_id);
console.log("Order ID:", order_id);
console.log("Amount:", amount);
console.log("Currency:", currency);
console.log("Generated Hash:", finalHash);
