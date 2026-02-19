// routes/attendanceRoutes.js
const express = require('express');
const {
  getAttendance,
  markAttendance,
  markBulkAttendance,
  getAttendanceByStudent,
  getAttendanceByCourse,
  updateAttendance,
  deleteAttendance,
  getAttendanceReport
} = require('../controllers/attendanceController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// General routes
router.get('/', getAttendance);
router.get('/reports', authorizeRoles('teacher', 'admin'), getAttendanceReport);

// Mark attendance
router.post('/', authorizeRoles('teacher', 'admin'), validate(validationSchemas.attendance), markAttendance);
router.post('/bulk', authorizeRoles('teacher', 'admin'), markBulkAttendance);

// Query routes
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/course/:courseId', authorizeRoles('teacher', 'admin'), getAttendanceByCourse);

// Update/Delete
router.put('/:id', authorizeRoles('teacher', 'admin'), updateAttendance);
router.delete('/:id', authorizeRoles('admin'), deleteAttendance);

module.exports = router;
