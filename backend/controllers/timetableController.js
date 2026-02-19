// controllers/timetableController.js
const Timetable = require('../models/Timetable');
const Course = require('../models/Course');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all timetable entries
// @route   GET /api/timetable
// @access  Public
exports.getTimetable = asyncHandler(async (req, res, next) => {
  const { semester, department, day } = req.query;

  const query = {};
  if (semester) query.semester = semester;
  if (department) query.department = department;
  if (day) query.day = day;

  const timetable = await Timetable.find(query)
    .populate('course', 'title courseCode')
    .populate('teacher', 'name email')
    .populate('department', 'name code')
    .sort('day startTime');

  res.status(200).json({
    success: true,
    count: timetable.length,
    data: timetable
  });
});

// @desc    Get single timetable entry
// @route   GET /api/timetable/:id
// @access  Public
exports.getTimetableEntry = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id)
    .populate('course', 'title courseCode credits')
    .populate('teacher', 'name email phone')
    .populate('department', 'name code');

  if (!timetable) {
    return next(new ErrorResponse(`Timetable entry not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc    Create timetable entry
// @route   POST /api/timetable
// @access  Private/Admin
exports.createTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.create(req.body);

  res.status(201).json({
    success: true,
    data: timetable
  });
});

// @desc    Update timetable entry
// @route   PUT /api/timetable/:id
// @access  Private/Admin
exports.updateTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!timetable) {
    return next(new ErrorResponse(`Timetable entry not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc    Delete timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private/Admin
exports.deleteTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable entry not found with id of ${req.params.id}`, 404));
  }

  await timetable.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get student timetable
// @route   GET /api/timetable/student/:studentId
// @access  Private
exports.getStudentTimetable = asyncHandler(async (req, res, next) => {
  const Student = require('../models/Student');
  const student = await Student.findById(req.params.studentId)
    .populate('courses')
    .populate('department');

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.studentId}`, 404));
  }

  const courseIds = student.courses.map(course => course._id);

  const timetable = await Timetable.find({
    course: { $in: courseIds },
    semester: student.semester,
    isActive: true
  })
    .populate('course', 'title courseCode')
    .populate('teacher', 'name email')
    .sort('day startTime');

  res.status(200).json({
    success: true,
    count: timetable.length,
    data: timetable
  });
});

// @desc    Get teacher timetable
// @route   GET /api/timetable/teacher/:teacherId
// @access  Private
exports.getTeacherTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.find({
    teacher: req.params.teacherId,
    isActive: true
  })
    .populate('course', 'title courseCode')
    .populate('department', 'name code')
    .sort('day startTime');

  res.status(200).json({
    success: true,
    count: timetable.length,
    data: timetable
  });
});
