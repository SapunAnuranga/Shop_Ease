const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    items: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product" 
        },
        name: String,
        price: Number,
        imageUrl: String,
        qty: Number,
        variantColor: String,
        size: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "failed", "charged_back"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["created", "processing", "shipped", "delivered", "cancelled"],
      default: "created",
    },
    payherePaymentId: String,
    actualPaidAmount: Number,
    customerInfo: {
      first_name: String,
      last_name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);