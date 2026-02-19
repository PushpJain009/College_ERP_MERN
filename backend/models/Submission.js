// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Please add an assignment']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please add a student']
  },
  files: [{
    filename: String,
    url: String,
    uploadDate: Date
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  marks: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String,
    trim: true
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: Date,
  status: {
    type: String,
    enum: ['Submitted', 'Graded', 'Resubmit'],
    default: 'Submitted'
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate submissions
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

// Pre-save hook to check if submission is late
submissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);

    if (assignment && new Date(this.submittedAt) > new Date(assignment.deadline)) {
      this.isLate = true;
    }
  }
  next();
});

module.exports = mongoose.model('Submission', submissionSchema);
