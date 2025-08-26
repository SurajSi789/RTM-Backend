const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  extension: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  stickyAgent: { type: Boolean, default: false },
  ringingTime: { type: Number, min: 10, max: 25, default: 15 },
  departmentType: { 
    type: String, 
    enum: ['Serial', 'Balanced', 'Simultaneous'], 
    default: 'Serial' 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', DepartmentSchema);