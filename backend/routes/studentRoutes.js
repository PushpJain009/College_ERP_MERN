// routes/studentRoutes.js
const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollCourse,
  unenrollCourse,
  getStudentCourses,
  getStudentGrades,
  getStudentAttendance
} = require('../controllers/studentController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// Basic CRUD routes
router
  .route('/')
  .get(getStudents)
  .post(authorizeRoles('admin'), validate(validationSchemas.student), createStudent);

router
  .route('/:id')
  .get(getStudent)
  .put(authorizeRoles('admin', 'teacher'), validate(validationSchemas.student), updateStudent)
  .delete(authorizeRoles('admin'), deleteStudent);

// Enrollment routes
router.post('/:id/enroll', authorizeRoles('admin'), enrollCourse);
router.delete('/:id/unenroll/:courseId', authorizeRoles('admin'), unenrollCourse);

// Student-specific routes
router.get('/:id/courses', getStudentCourses);
router.get('/:id/grades', getStudentGrades);
router.get('/:id/attendance', getStudentAttendance);

module.exports = router;

