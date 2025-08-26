const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('agent').sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET message stats
router.get('/stats', async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const sentMessages = await Message.countDocuments({ status: 'sent' });
    const deliveredMessages = await Message.countDocuments({ status: 'delivered' });
    
    res.json({
      total: totalMessages,
      sent: sentMessages,
      delivered: deliveredMessages,
      deliveryRate: totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
