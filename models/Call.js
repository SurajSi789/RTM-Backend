const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  callId: { type: String, required: true, unique: true },
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ['answered', 'missed', 'busy', 'failed'], required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  recording: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Call', CallSchema);