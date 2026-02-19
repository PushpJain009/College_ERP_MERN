// routes/gradeRoutes.js
const express = require('express');
const {
  getGrades,
  getGradesByStudent,
  getGradesByExam,
  addGrade,
  updateGrade,
  deleteGrade,
  publishGrade
} = require('../controllers/gradeController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// Query routes
router.get('/', getGrades);
router.get('/student/:studentId', getGradesByStudent);
router.get('/exam/:examId', authorizeRoles('teacher', 'admin'), getGradesByExam);

// CRUD routes
router.post('/', authorizeRoles('teacher', 'admin'), validate(validationSchemas.grade), addGrade);
router.put('/:id', authorizeRoles('teacher', 'admin'), validate(validationSchemas.grade), updateGrade);
router.delete('/:id', authorizeRoles('admin'), deleteGrade);

// Publish grade
router.put('/:id/publish', authorizeRoles('teacher', 'admin'), publishGrade);

module.exports = router;
