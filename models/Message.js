const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['sms', 'whatsapp', 'email'], required: true },
  status: { type: String, enum: ['sent', 'delivered', 'failed', 'pending'], default: 'pending' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  campaign: { type: String },
  sentAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
