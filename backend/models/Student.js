// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a student name'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Please add a roll number'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  guardianName: String,
  guardianPhone: String,
  guardianEmail: String,
  admissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Calculate attendance percentage for a student
studentSchema.methods.getAttendancePercentage = async function() {
  const Attendance = mongoose.model('Attendance');
  const total = await Attendance.countDocuments({ student: this._id });
  const present = await Attendance.countDocuments({
    student: this._id,
    status: { $in: ['Present', 'Late'] }
  });
  return total > 0 ? ((present / total) * 100).toFixed(2) : 0;
};

module.exports = mongoose.model('Student', studentSchema);


