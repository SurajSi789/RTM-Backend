const express = require('express');
const router = express.Router();
const Call = require('../models/Call');

// GET all calls
router.get('/', async (req, res) => {
  try {
    const calls = await Call.find();
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create call
router.post('/', async (req, res) => {
  try {
    const call = new Call(req.body);
    await call.save();
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;