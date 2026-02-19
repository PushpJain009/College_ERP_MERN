// controllers/courseController.js
const Course = require('../models/Course');
const { ErrorResponse } = require('../middleware/errorHandler');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
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
  query = Course.find(JSON.parse(queryStr))
    .populate('department', 'name code')
    .populate('teacher', 'name email')
    .populate('enrolledStudents', 'name rollNumber');

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
  const total = await Course.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const courses = await query;

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
    count: courses.length,
    pagination,
    total,
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('department', 'name code')
    .populate('teacher', 'name email phone')
    .populate('enrolledStudents', 'name rollNumber email')
    .populate('prerequisites', 'title courseCode');

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin/Teacher
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course teacher or admin
  if (
    course.teacher.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 403)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get enrolled students for a course
// @route   GET /api/courses/:id/students
// @access  Private
exports.getCourseStudents = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'enrolledStudents',
    select: 'name rollNumber email phone semester',
    populate: {
      path: 'department',
      select: 'name code'
    }
  });

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: course.enrolledStudents.length,
    maxStudents: course.maxStudents,
    isFull: course.isFull(),
    data: course.enrolledStudents
  });
});

// @desc    Get course by department
// @route   GET /api/courses/department/:departmentId
// @access  Public
exports.getCoursesByDepartment = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ department: req.params.departmentId })
    .populate('teacher', 'name email')
    .sort('semester title');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get course by semester
// @route   GET /api/courses/semester/:semester
// @access  Public
exports.getCoursesBySemester = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ semester: req.params.semester })
    .populate('department', 'name code')
    .populate('teacher', 'name email')
    .sort('title');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get courses by teacher
// @route   GET /api/courses/teacher/:teacherId
// @access  Private
exports.getCoursesByTeacher = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ teacher: req.params.teacherId })
    .populate('department', 'name code')
    .populate('enrolledStudents', 'name rollNumber');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});
