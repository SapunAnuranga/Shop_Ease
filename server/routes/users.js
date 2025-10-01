const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to check auth + role
function authorize(roles = []) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Forbidden' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Invalid token' });
    }
  };
}

// Get all users (Admin only)
router.get('/', authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create user (Admin only)
router.post('/create', authorize(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hash, role });
    await user.save();
    
    res.json({ 
      success: true, 
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update user (Admin only)
router.put('/:id', authorize(['admin']), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user (Admin only)
router.delete('/:id', authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;