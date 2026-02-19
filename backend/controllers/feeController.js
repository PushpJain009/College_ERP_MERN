// controllers/feeController.js
const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all fee structures
// @route   GET /api/fees
// @access  Private
exports.getFeeStructures = asyncHandler(async (req, res, next) => {
  const feeStructures = await FeeStructure.find()
    .populate('department', 'name code')
    .sort('-academicYear -semester');

  res.status(200).json({
    success: true,
    count: feeStructures.length,
    data: feeStructures
  });
});

// @desc    Get single fee structure
// @route   GET /api/fees/:id
// @access  Private
exports.getFeeStructure = asyncHandler(async (req, res, next) => {
  const feeStructure = await FeeStructure.findById(req.params.id)
    .populate('department', 'name code');

  if (!feeStructure) {
    return next(new ErrorResponse(`Fee structure not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: feeStructure
  });
});

// @desc    Create fee structure
// @route   POST /api/fees
// @access  Private/Admin
exports.createFeeStructure = asyncHandler(async (req, res, next) => {
  const feeStructure = await FeeStructure.create(req.body);

  res.status(201).json({
    success: true,
    data: feeStructure
  });
});

// @desc    Update fee structure
// @route   PUT /api/fees/:id
// @access  Private/Admin
exports.updateFeeStructure = asyncHandler(async (req, res, next) => {
  const feeStructure = await FeeStructure.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!feeStructure) {
    return next(new ErrorResponse(`Fee structure not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: feeStructure
  });
});

// @desc    Delete fee structure
// @route   DELETE /api/fees/:id
// @access  Private/Admin
exports.deleteFeeStructure = asyncHandler(async (req, res, next) => {
  const feeStructure = await FeeStructure.findById(req.params.id);

  if (!feeStructure) {
    return next(new ErrorResponse(`Fee structure not found with id of ${req.params.id}`, 404));
  }

  await feeStructure.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get student fees
// @route   GET /api/fees/student/:studentId
// @access  Private
exports.getStudentFees = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.studentId).populate('department');

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.studentId}`, 404));
  }

  // Get applicable fee structure
  const feeStructure = await FeeStructure.findOne({
    department: student.department,
    semester: student.semester,
    isActive: true
  });

  // Get payment history
  const payments = await FeePayment.find({
    student: req.params.studentId
  }).sort('-paidAt');

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const totalDue = feeStructure ? feeStructure.totalAmount : 0;
  const balance = totalDue - totalPaid;

  res.status(200).json({
    success: true,
    data: {
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        semester: student.semester
      },
      feeStructure,
      payments,
      summary: {
        totalDue,
        totalPaid,
        balance,
        status: balance <= 0 ? 'Paid' : balance < totalDue ? 'Partial' : 'Pending'
      }
    }
  });
});

// @desc    Record fee payment
// @route   POST /api/fees/payment
// @access  Private/Admin
exports.recordPayment = asyncHandler(async (req, res, next) => {
  req.body.collectedBy = req.user.id;

  const payment = await FeePayment.create(req.body);

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Get fee payment history
// @route   GET /api/fees/payments
// @access  Private/Admin
exports.getPaymentHistory = asyncHandler(async (req, res, next) => {
  const payments = await FeePayment.find()
    .populate('student', 'name rollNumber')
    .populate('feeStructure', 'name academicYear')
    .populate('collectedBy', 'name')
    .sort('-paidAt');

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc    Get fee reports
// @route   GET /api/fees/reports
// @access  Private/Admin
exports.getFeeReports = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, department } = req.query;

  const query = {};
  if (startDate && endDate) {
    query.paidAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const payments = await FeePayment.find(query)
    .populate('student', 'name rollNumber department')
    .populate('feeStructure');

  const totalCollected = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);

  res.status(200).json({
    success: true,
    count: payments.length,
    totalCollected,
    data: payments
  });
});
