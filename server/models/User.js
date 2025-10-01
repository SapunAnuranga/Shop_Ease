const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "marketing", "content", "sales", "customer"],
    default: "customer",
  },
  permissions: { type: [String], default: [] },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

// Auto-assign permissions based on role
UserSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    switch (this.role) {
      case "admin":
        this.permissions = ["user:*", "product:*", "order:*", "promo:*"];
        break;
      case "marketing":
        this.permissions = ["promo:create", "promo:view", "report:view"];
        break;
      case "content":
        this.permissions = ["product:update", "seo:update", "media:upload"];
        break;
      case "sales":
        this.permissions = ["order:view", "order:update", "report:view"];
        break;
      default:
        this.permissions = [];
        break;
    }
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);