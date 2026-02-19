// models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please add a student']
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Please add an exam']
  },
  marksObtained: {
    type: Number,
    required: [true, 'Please add marks obtained'],
    min: 0
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    trim: true
  },
  percentage: Number,
  remarks: {
    type: String,
    trim: true
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: Date
}, {
  timestamps: true
});

// Create compound index to prevent duplicate entries
gradeSchema.index({ student: 1, exam: 1 }, { unique: true });

// Calculate grade based on percentage
gradeSchema.methods.calculateGrade = function() {
  const percentage = this.percentage;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'F';
};

// Pre-save hook to calculate percentage and grade
gradeSchema.pre('save', async function(next) {
  if (this.isModified('marksObtained')) {
    const Exam = mongoose.model('Exam');
    const exam = await Exam.findById(this.exam);

    if (exam) {
      this.percentage = ((this.marksObtained / exam.maxMarks) * 100).toFixed(2);
      this.grade = this.calculateGrade();
    }
  }
  next();
});

// Static method to calculate GPA/CGPA
gradeSchema.statics.calculateGPA = function(grades) {
  const gradePoints = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
    'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };

  let totalPoints = 0;
  let totalCourses = 0;

  grades.forEach(grade => {
    if (grade.grade && gradePoints[grade.grade] !== undefined) {
      totalPoints += gradePoints[grade.grade];
      totalCourses++;
    }
  });

  return totalCourses > 0 ? (totalPoints / totalCourses).toFixed(2) : 0;
};

module.exports = mongoose.model('Grade', gradeSchema);
