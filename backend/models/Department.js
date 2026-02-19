// models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add a department code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    trim: true
  },
  established: Date,
  building: String,
  phone: String,
  email: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Get total students in department
departmentSchema.methods.getTotalStudents = async function() {
  const Student = mongoose.model('Student');
  return await Student.countDocuments({ department: this._id, status: 'Active' });
};

// Get total courses in department
departmentSchema.methods.getTotalCourses = async function() {
  const Course = mongoose.model('Course');
  return await Course.countDocuments({ department: this._id, status: 'Active' });
};

module.exports = mongoose.model('Department', departmentSchema);
