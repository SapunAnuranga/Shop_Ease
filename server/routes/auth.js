const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      passwordHash: hash, 
      role: role || "customer" 
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get current user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;