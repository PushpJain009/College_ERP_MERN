// controllers/examController.js
const Exam = require('../models/Exam');
const Course = require('../models/Course');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
exports.getExams = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;

  const query = courseId ? { course: courseId } : {};

  const exams = await Exam.find(query)
    .populate('course', 'title courseCode')
    .populate('createdBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams
  });
});

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
exports.getExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id)
    .populate('course', 'title courseCode credits')
    .populate('createdBy', 'name email');

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  const statistics = await exam.getStatistics();

  res.status(200).json({
    success: true,
    data: {
      ...exam.toObject(),
      statistics
    }
  });
});

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Teacher/Admin
exports.createExam = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const exam = await Exam.create(req.body);

  res.status(201).json({
    success: true,
    data: exam
  });
});

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Teacher/Admin
exports.updateExam = asyncHandler(async (req, res, next) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this exam`, 403));
  }

  exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
exports.deleteExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  await exam.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Publish exam results
// @route   PUT /api/exams/:id/publish
// @access  Private/Teacher/Admin
exports.publishExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  exam.isPublished = true;
  exam.publishDate = Date.now();
  await exam.save();

  res.status(200).json({
    success: true,
    data: exam
  });
});
