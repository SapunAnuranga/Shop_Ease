const mongoose = require("mongoose");

const PromoSchema = new mongoose.Schema(
  {
    code: { 
      type: String, 
      unique: true, 
      required: true, 
      trim: true, 
      uppercase: true 
    },
    discountType: { 
      type: String, 
      enum: ["percent", "fixed"], 
      default: "percent" 
    },
    discountValue: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    minAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: null },
    uses: { type: Number, default: 0 },
    firstTimeOnly: { type: Boolean, default: false },
    recurringCustomerDiscount: { type: Boolean, default: false },
    validFrom: { type: Date, default: null },
    validTo: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promo", PromoSchema);