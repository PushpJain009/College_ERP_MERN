// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please add a student']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course']
  },
  date: {
    type: Date,
    required: [true, 'Please add attendance date'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: [true, 'Please add attendance status']
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate entries
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

// Static method to get attendance percentage
attendanceSchema.statics.getAttendancePercentage = async function(studentId, courseId) {
  const query = { student: studentId };
  if (courseId) query.course = courseId;

  const total = await this.countDocuments(query);
  const present = await this.countDocuments({
    ...query,
    status: { $in: ['Present', 'Late'] }
  });

  return total > 0 ? ((present / total) * 100).toFixed(2) : 0;
};

module.exports = mongoose.model('Attendance', attendanceSchema);
