const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Login route
router.post('/login', async (req, res) => {
  try {
    const { number, password } = req.body;

    console.log('Login attempt for number:', number);

    // Find user by phone number
    const user = await User.findOne({ number });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { 
      id: user._id, 
      name: user.name, 
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    // Check if user has a password field
    if (!user.password) {
      console.log('User has no password field');
      return res.status(400).json({ message: 'Account not properly configured. Please contact administrator.' });
    }

    // Check password using bcrypt (all passwords should now be hashed)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User is inactive');
      return res.status(400).json({ message: 'Account is inactive' });
    }

    console.log('Login successful for user:', user.name);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

module.exports = router;