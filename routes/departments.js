const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'name email')
      .populate('users', 'name email role');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create department
router.post('/', async (req, res) => {
  try {
    // Validate ringing time
    if (req.body.ringingTime && (req.body.ringingTime < 10 || req.body.ringingTime > 25)) {
      return res.status(400).json({ message: 'Ringing time must be between 10 and 25 seconds' });
    }

    // Clean up empty fields
    const departmentData = { ...req.body };
    
    // Remove empty manager
    if (!departmentData.manager || departmentData.manager === '') {
      delete departmentData.manager;
    }
    
    // Remove empty users array or filter out empty values
    if (!departmentData.users || departmentData.users.length === 0) {
      delete departmentData.users;
    } else {
      departmentData.users = departmentData.users.filter(userId => userId && userId !== '');
    }

    const department = new Department(departmentData);
    await department.save();
    
    // Populate the response only if fields exist
    if (department.manager) {
      await department.populate('manager', 'name email');
    }
    if (department.users && department.users.length > 0) {
      await department.populate('users', 'name email role');
    }
    
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department name or extension already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// PUT update department (for later editing)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ringing time
    if (req.body.ringingTime && (req.body.ringingTime < 10 || req.body.ringingTime > 25)) {
      return res.status(400).json({ message: 'Ringing time must be between 10 and 25 seconds' });
    }

    // Clean up empty fields
    const updateData = { ...req.body };
    
    // Handle empty manager
    if (!updateData.manager || updateData.manager === '' || updateData.manager === null) {
      updateData.manager = null;
    }
    
    // Handle empty users
    if (updateData.users) {
      updateData.users = updateData.users.filter(userId => userId && userId !== '');
    }

    const department = await Department.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    })
    .populate('manager', 'name email')
    .populate('users', 'name email role');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department name or extension already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE department
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ 
      message: 'Department deleted successfully', 
      deletedDepartment: {
        id: department._id,
        name: department.name,
        extension: department.extension
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;