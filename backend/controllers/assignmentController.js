// controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = asyncHandler(async (req, res, next) => {
  const { courseId, status } = req.query;

  const query = {};
  if (courseId) query.course = courseId;
  if (status) query.status = status;

  const assignments = await Assignment.find(query)
    .populate('course', 'title courseCode')
    .populate('teacher', 'name email')
    .sort('-publishedAt');

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments
  });
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('course', 'title courseCode')
    .populate('teacher', 'name email');

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: assignment
  });
});

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private/Teacher/Admin
exports.createAssignment = asyncHandler(async (req, res, next) => {
  req.body.teacher = req.user.id;

  const assignment = await Assignment.create(req.body);

  res.status(201).json({
    success: true,
    data: assignment
  });
});

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Teacher/Admin
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  // Check authorization
  if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this assignment`, 403));
  }

  assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: assignment
  });
});

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  await assignment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get assignment submissions
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
exports.getAssignmentSubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await Submission.find({ assignment: req.params.id })
    .populate('student', 'name rollNumber email')
    .populate('gradedBy', 'name')
    .sort('-submittedAt');

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions
  });
});

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  // Check if already submitted
  const existingSubmission = await Submission.findOne({
    assignment: req.params.id,
    student: req.body.studentId
  });

  if (existingSubmission) {
    return next(new ErrorResponse('Assignment already submitted', 400));
  }

  const submission = await Submission.create({
    assignment: req.params.id,
    student: req.body.studentId,
    files: req.body.files
  });

  res.status(201).json({
    success: true,
    data: submission
  });
});

// @desc    Grade submission
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private/Teacher/Admin
exports.gradeSubmission = asyncHandler(async (req, res, next) => {
  const { marks, feedback } = req.body;

  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    return next(new ErrorResponse(`Submission not found with id of ${req.params.id}`, 404));
  }

  submission.marks = marks;
  submission.feedback = feedback;
  submission.gradedBy = req.user.id;
  submission.gradedAt = Date.now();
  submission.status = 'Graded';

  await submission.save();

  res.status(200).json({
    success: true,
    data: submission
  });
});
