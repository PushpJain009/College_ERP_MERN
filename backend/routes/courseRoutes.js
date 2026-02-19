// routes/courseRoutes.js
const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  getCoursesByDepartment,
  getCoursesBySemester,
  getCoursesByTeacher
} = require('../controllers/courseController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Query routes (public)
router.get('/department/:departmentId', getCoursesByDepartment);
router.get('/semester/:semester', getCoursesBySemester);
router.get('/teacher/:teacherId', protect, getCoursesByTeacher);

// Protected routes
router.use(protect);

// CRUD routes
router
  .route('/')
  .post(authorizeRoles('admin'), validate(validationSchemas.course), createCourse);

router
  .route('/:id')
  .put(authorizeRoles('admin', 'teacher'), validate(validationSchemas.course), updateCourse)
  .delete(authorizeRoles('admin'), deleteCourse);

// Course-specific routes
router.get('/:id/students', getCourseStudents);

module.exports = router;

