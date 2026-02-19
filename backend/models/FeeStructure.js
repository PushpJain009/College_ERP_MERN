// models/FeeStructure.js
const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add fee structure name'],
    trim: true
  },
  academicYear: {
    type: String,
    required: [true, 'Please add academic year']
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
  components: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: String
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Please add total amount'],
    min: 0
  },
  dueDate: Date,
  lateFeePenalty: {
    type: Number,
    default: 0
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total amount from components
feeStructureSchema.pre('save', function(next) {
  if (this.components && this.components.length > 0) {
    this.totalAmount = this.components.reduce((sum, component) => sum + component.amount, 0);
  }
  next();
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
