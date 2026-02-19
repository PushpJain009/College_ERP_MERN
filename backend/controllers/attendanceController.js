// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find()
    .populate('student', 'name rollNumber')
    .populate('course', 'title courseCode')
    .populate('markedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Teacher/Admin
exports.markAttendance = asyncHandler(async (req, res, next) => {
  req.body.markedBy = req.user.id;

  const attendance = await Attendance.create(req.body);

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc    Mark bulk attendance
// @route   POST /api/attendance/bulk
// @access  Private/Teacher/Admin
exports.markBulkAttendance = asyncHandler(async (req, res, next) => {
  const { courseId, date, attendanceList } = req.body;

  const attendanceRecords = attendanceList.map(record => ({
    student: record.studentId,
    course: courseId,
    date,
    status: record.status,
    markedBy: req.user.id,
    remarks: record.remarks || ''
  }));

  const attendance = await Attendance.insertMany(attendanceRecords);

  res.status(201).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get attendance by student
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getAttendanceByStudent = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;

  const query = { student: req.params.studentId };
  if (courseId) query.course = courseId;

  const attendance = await Attendance.find(query)
    .populate('course', 'title courseCode')
    .populate('markedBy', 'name')
    .sort('-date');

  const percentage = await Attendance.getAttendancePercentage(
    req.params.studentId,
    courseId
  );

  res.status(200).json({
    success: true,
    count: attendance.length,
    attendancePercentage: percentage,
    data: attendance
  });
});

// @desc    Get attendance by course
// @route   GET /api/attendance/course/:courseId
// @access  Private
exports.getAttendanceByCourse = asyncHandler(async (req, res, next) => {
  const { date } = req.query;

  const query = { course: req.params.courseId };
  if (date) query.date = new Date(date);

  const attendance = await Attendance.find(query)
    .populate('student', 'name rollNumber')
    .populate('markedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private/Teacher/Admin
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!attendance) {
    return next(new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404));
  }

  await attendance.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get attendance report
// @route   GET /api/attendance/reports
// @access  Private/Teacher/Admin
exports.getAttendanceReport = asyncHandler(async (req, res, next) => {
  const { courseId, startDate, endDate } = req.query;

  const query = {};
  if (courseId) query.course = courseId;
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const attendance = await Attendance.find(query)
    .populate('student', 'name rollNumber')
    .populate('course', 'title courseCode');

  // Calculate statistics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => ['Present', 'Late'].includes(a.status)).length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const percentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    statistics: {
      totalRecords,
      presentCount,
      absentCount,
      percentage
    },
    data: attendance
  });
});
