// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add assignment title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add assignment description'],
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please add maximum marks'],
    min: 1
  },
  deadline: {
    type: Date,
    required: [true, 'Please add deadline']
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: Date
  }],
  instructions: String,
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Closed'],
    default: 'Published'
  }
}, {
  timestamps: true
});

// Virtual for submissions
assignmentSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'assignment',
  justOne: false
});

// Check if assignment is overdue
assignmentSchema.methods.isOverdue = function() {
  return new Date() > new Date(this.deadline);
};

module.exports = mongoose.model('Assignment', assignmentSchema);
