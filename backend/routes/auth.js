const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Route (Mock check for now)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only sending basic info back, normally we'd send a JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user (Settings)
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    console.log(`🗑️ Attempting to delete user with ID: ${req.params.id}`);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      console.log(`❌ User not found: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`✅ User deleted successfully: ${user.name} (${user.email})`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
