// models/Timetable.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a teacher']
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: [true, 'Please add a day']
  },
  startTime: {
    type: String,
    required: [true, 'Please add start time'] // Format: "HH:MM" (24-hour)
  },
  endTime: {
    type: String,
    required: [true, 'Please add end time'] // Format: "HH:MM" (24-hour)
  },
  room: {
    type: String,
    required: [true, 'Please add room number'],
    trim: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  academicYear: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  type: {
    type: String,
    enum: ['Lecture', 'Lab', 'Tutorial', 'Practical'],
    default: 'Lecture'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent scheduling conflicts
timetableSchema.index({ day: 1, startTime: 1, room: 1 }, { unique: true });
timetableSchema.index({ day: 1, startTime: 1, teacher: 1 }, { unique: true });

// Validate time format and logic
timetableSchema.pre('save', function(next) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(this.startTime) || !timeRegex.test(this.endTime)) {
    return next(new Error('Invalid time format. Use HH:MM (24-hour format)'));
  }

  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes >= endMinutes) {
    return next(new Error('End time must be after start time'));
  }

  next();
});

module.exports = mongoose.model('Timetable', timetableSchema);
