// models/FeePayment.js
const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Please add a student']
  },
  feeStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
    required: [true, 'Please add fee structure']
  },
  amountPaid: {
    type: Number,
    required: [true, 'Please add amount paid'],
    min: 0
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Cheque', 'Online', 'Bank Transfer'],
    required: [true, 'Please add payment mode']
  },
  transactionId: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  receiptNumber: {
    type: String,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Partial', 'Refunded'],
    default: 'Paid'
  },
  remarks: {
    type: String,
    trim: true
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate receipt number
feePaymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.receiptNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `RCP-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);
