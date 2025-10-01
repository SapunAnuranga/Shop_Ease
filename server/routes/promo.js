const express = require("express");
const router = express.Router();
const Promo = require("../models/Promo");

// GET all active promos
router.get("/", async (req, res) => {
  try {
    const promos = await Promo.find({ active: true });
    res.json({ success: true, promos });
  } catch (err) {
    console.error("Get promos error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch promos" });
  }
});

// CREATE new promo
router.post("/create", async (req, res) => {
  try {
    // Normalize code
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase().trim();
    }
    
    const promo = new Promo(req.body);
    await promo.save();
    
    res.json({ success: true, promo });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo code already exists" 
      });
    }
    console.error("Create promo error:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// DELETE promo
router.delete("/:id", async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    
    if (!promo) {
      return res.status(404).json({ 
        success: false, 
        message: "Promo not found" 
      });
    }
    
    res.json({ success: true, message: "Promo deleted successfully" });
  } catch (err) {
    console.error("Delete promo error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Delete failed" 
    });
  }
});

// APPLY promo code
router.post("/apply", async (req, res) => {
  try {
    const { code, cartTotal = 0, userId = null, isFirstOrder = false } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo code is required" 
      });
    }

    const promo = await Promo.findOne({ 
      code: code.toUpperCase(), 
      active: true 
    });
    
    if (!promo) {
      return res.status(404).json({ 
        success: false, 
        message: "Promo code not found" 
      });
    }

    const now = new Date();
    if (promo.validFrom && promo.validFrom > now) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo not yet active" 
      });
    }
    
    if (promo.validTo && promo.validTo < now) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo expired" 
      });
    }
    
    if (promo.maxUses !== null && promo.uses >= promo.maxUses) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo usage limit reached" 
      });
    }
    
    if (cartTotal < (promo.minAmount || 0)) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum cart amount is Rs. ${promo.minAmount}` 
      });
    }
    
    if (promo.firstTimeOnly && !isFirstOrder) {
      return res.status(400).json({ 
        success: false, 
        message: "Promo valid for first time customers only" 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === "percent") {
      discountAmount = (cartTotal * promo.discountValue) / 100;
    } else {
      discountAmount = promo.discountValue;
    }
    
    // Cap discount to cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    // Increment uses
    promo.uses = (promo.uses || 0) + 1;
    await promo.save();

    const newTotal = cartTotal - discountAmount;
    
    res.json({ 
      success: true, 
      discountAmount, 
      newTotal, 
      promo 
    });
  } catch (err) {
    console.error("Apply promo error", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to apply promo" 
    });
  }
});

module.exports = router;