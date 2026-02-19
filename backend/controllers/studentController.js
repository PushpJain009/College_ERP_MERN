// controllers/studentController.js
const Student = require('../models/Student');
const Course = require('../models/Course');
const { ErrorResponse } = require('../middleware/errorHandler');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Student.find(JSON.parse(queryStr))
    .populate('department', 'name code')
    .populate('courses', 'title courseCode')
    .populate('user', 'name email');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Student.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const students = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: students.length,
    pagination,
    total,
    data: students
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('department', 'name code')
    .populate('courses', 'title courseCode credits')
    .populate('user', 'name email phone');

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  // Get attendance percentage
  const attendancePercentage = await student.getAttendancePercentage();

  res.status(200).json({
    success: true,
    data: {
      ...student.toObject(),
      attendancePercentage
    }
  });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Enroll student in course
// @route   POST /api/students/:id/enroll
// @access  Private/Admin
exports.enrollCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  const student = await Student.findById(req.params.id);
  const course = await Course.findById(courseId);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${courseId}`, 404));
  }

  // Check if already enrolled
  if (student.courses.includes(courseId)) {
    return next(new ErrorResponse('Student already enrolled in this course', 400));
  }

  // Check if course is full
  if (course.isFull()) {
    return next(new ErrorResponse('Course is full', 400));
  }

  // Add course to student
  student.courses.push(courseId);
  await student.save();

  // Add student to course
  course.enrolledStudents.push(student._id);
  await course.save();

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Unenroll student from course
// @route   DELETE /api/students/:id/unenroll/:courseId
// @access  Private/Admin
exports.unenrollCourse = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  const course = await Course.findById(req.params.courseId);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
  }

  // Remove course from student
  student.courses = student.courses.filter(
    course => course.toString() !== req.params.courseId
  );
  await student.save();

  // Remove student from course
  course.enrolledStudents = course.enrolledStudents.filter(
    student => student.toString() !== req.params.id
  );
  await course.save();

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Get student courses
// @route   GET /api/students/:id/courses
// @access  Private
exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate({
    path: 'courses',
    populate: {
      path: 'teacher',
      select: 'name email'
    }
  });

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: student.courses.length,
    data: student.courses
  });
});

// @desc    Get student grades
// @route   GET /api/students/:id/grades
// @access  Private
exports.getStudentGrades = asyncHandler(async (req, res, next) => {
  const Grade = require('../models/Grade');

  const grades = await Grade.find({ student: req.params.id })
    .populate({
      path: 'exam',
      populate: {
        path: 'course',
        select: 'title courseCode'
      }
    });

  // Calculate GPA
  const gpa = Grade.calculateGPA(grades);

  res.status(200).json({
    success: true,
    count: grades.length,
    gpa,
    data: grades
  });
});

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const Attendance = require('../models/Attendance');

  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  const attendance = await Attendance.find({ student: req.params.id })
    .populate('course', 'title courseCode')
    .populate('markedBy', 'name')
    .sort('-date');

  const attendancePercentage = await student.getAttendancePercentage();

  res.status(200).json({
    success: true,
    count: attendance.length,
    attendancePercentage,
    data: attendance
  });
});
