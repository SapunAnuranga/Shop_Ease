const mongoose = require("mongoose");

const SizeStockSchema = new mongoose.Schema({
  sizeLabel: String,
  countrySizes: { 
    US: String, 
    UK: String, 
    EU: String, 
    AU: String, 
    JP: String 
  },
  stock: { type: Number, default: 0 },
  sku: String,
});

const VariantSchema = new mongoose.Schema({
  color: String,
  colorCode: String,
  images: [String],
  model3d: String,
  arOverlay: String,
  price: Number,
  originalPrice: Number,
  sizes: [SizeStockSchema],
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, index: true },
  description: String,
  brand: String,
  category: String,
  tags: [String],
  basePrice: { type: Number, required: true },
  imageUrl: String,
  variants: [VariantSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSold: { type: Number, default: 0 },
  isDeal: { type: Boolean, default: false },
  dealEnd: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);