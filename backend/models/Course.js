// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  courseCode: {
    type: String,
    required: [true, 'Please add a course code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  credits: {
    type: Number,
    required: [true, 'Please add course credits'],
    min: 1,
    max: 6
  },
  syllabus: String,
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  maxStudents: {
    type: Number,
    default: 60
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  academicYear: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Get enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents?.length || 0;
});

// Check if course is full
courseSchema.methods.isFull = function() {
  return this.enrolledStudents.length >= this.maxStudents;
};

module.exports = mongoose.model('Course', courseSchema);
