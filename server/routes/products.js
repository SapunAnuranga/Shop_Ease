const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const Product = require("../models/Product");

const router = express.Router();
const upload = multer({ storage });

// Create new product (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, brand, category, tags, basePrice, rating } = req.body;

    const product = new Product({
      name,
      description,
      brand,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      basePrice,
      rating: rating ? Number(rating) : 0,
      imageUrl: req.file?.path || null,
    });

    await product.save();
    
    res.json({ 
      message: "✅ Product created successfully", 
      product 
    });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error("❌ Fetch products failed:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ product });
  } catch (err) {
    console.error("❌ Fetch product failed:", err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

// Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    
    if (updateData.tags) {
      updateData.tags = updateData.tags.split(",").map(t => t.trim());
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ 
      message: "✅ Product updated successfully", 
      product 
    });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;