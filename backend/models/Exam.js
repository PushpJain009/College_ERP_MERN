// models/Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add exam name'],
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course']
  },
  date: {
    type: Date,
    required: [true, 'Please add exam date']
  },
  duration: {
    type: Number, // in minutes
    default: 180
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please add maximum marks'],
    min: 1
  },
  weightage: {
    type: Number, // Percentage contribution to final grade
    min: 0,
    max: 100,
    default: 100
  },
  type: {
    type: String,
    enum: ['Quiz', 'Midterm', 'Final', 'Assignment', 'Project'],
    required: [true, 'Please add exam type']
  },
  description: {
    type: String,
    trim: true
  },
  room: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: Date
}, {
  timestamps: true
});

// Calculate statistics for an exam
examSchema.methods.getStatistics = async function() {
  const Grade = mongoose.model('Grade');
  const grades = await Grade.find({ exam: this._id });

  if (grades.length === 0) {
    return {
      totalStudents: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0
    };
  }

  const marks = grades.map(g => g.marksObtained);
  const average = marks.reduce((a, b) => a + b, 0) / marks.length;

  return {
    totalStudents: grades.length,
    averageMarks: average.toFixed(2),
    highestMarks: Math.max(...marks),
    lowestMarks: Math.min(...marks)
  };
};

module.exports = mongoose.model('Exam', examSchema);
