// controllers/gradeController.js
const Grade = require('../models/Grade');
const Exam = require('../models/Exam');
const Student = require('../models/Student');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all grades
// @route   GET /api/grades
// @access  Private
exports.getGrades = asyncHandler(async (req, res, next) => {
  const grades = await Grade.find()
    .populate('student', 'name rollNumber')
    .populate({
      path: 'exam',
      populate: { path: 'course', select: 'title courseCode' }
    })
    .populate('gradedBy', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades
  });
});

// @desc    Get grades by student
// @route   GET /api/grades/student/:studentId
// @access  Private
exports.getGradesByStudent = asyncHandler(async (req, res, next) => {
  const grades = await Grade.find({ student: req.params.studentId })
    .populate({
      path: 'exam',
      populate: { path: 'course', select: 'title courseCode credits' }
    })
    .populate('gradedBy', 'name')
    .sort('-createdAt');

  const gpa = Grade.calculateGPA(grades);

  res.status(200).json({
    success: true,
    count: grades.length,
    gpa,
    data: grades
  });
});

// @desc    Get grades by exam
// @route   GET /api/grades/exam/:examId
// @access  Private
exports.getGradesByExam = asyncHandler(async (req, res, next) => {
  const grades = await Grade.find({ exam: req.params.examId })
    .populate('student', 'name rollNumber')
    .populate('gradedBy', 'name')
    .sort('-marksObtained');

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades
  });
});

// @desc    Add grade
// @route   POST /api/grades
// @access  Private/Teacher/Admin
exports.addGrade = asyncHandler(async (req, res, next) => {
  req.body.gradedBy = req.user.id;

  const grade = await Grade.create(req.body);

  res.status(201).json({
    success: true,
    data: grade
  });
});

// @desc    Update grade
// @route   PUT /api/grades/:id
// @access  Private/Teacher/Admin
exports.updateGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!grade) {
    return next(new ErrorResponse(`Grade not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: grade
  });
});

// @desc    Delete grade
// @route   DELETE /api/grades/:id
// @access  Private/Admin
exports.deleteGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    return next(new ErrorResponse(`Grade not found with id of ${req.params.id}`, 404));
  }

  await grade.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Publish grade
// @route   PUT /api/grades/:id/publish
// @access  Private/Teacher/Admin
exports.publishGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    return next(new ErrorResponse(`Grade not found with id of ${req.params.id}`, 404));
  }

  grade.publishedAt = Date.now();
  await grade.save();

  res.status(200).json({
    success: true,
    data: grade
  });
});
