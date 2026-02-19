// routes/timetableRoutes.js
const express = require('express');
const {
  getTimetable,
  getTimetableEntry,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getStudentTimetable,
  getTeacherTimetable
} = require('../controllers/timetableController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// Public routes
router.get('/', getTimetable);
router.get('/:id', getTimetableEntry);

// Protected routes
router.use(protect);

// Query routes
router.get('/student/:studentId', getStudentTimetable);
router.get('/teacher/:teacherId', getTeacherTimetable);

// CRUD routes (Admin only)
router.post('/', authorizeRoles('admin'), validate(validationSchemas.timetable), createTimetable);
router.put('/:id', authorizeRoles('admin'), validate(validationSchemas.timetable), updateTimetable);
router.delete('/:id', authorizeRoles('admin'), deleteTimetable);

module.exports = router;
