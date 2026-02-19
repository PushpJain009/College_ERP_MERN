// routes/assignmentRoutes.js
const express = require('express');
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  submitAssignment,
  gradeSubmission
} = require('../controllers/assignmentController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getAssignments)
  .post(authorizeRoles('teacher', 'admin'), validate(validationSchemas.assignment), createAssignment);

router
  .route('/:id')
  .get(getAssignment)
  .put(authorizeRoles('teacher', 'admin'), validate(validationSchemas.assignment), updateAssignment)
  .delete(authorizeRoles('admin'), deleteAssignment);

// Assignment-specific routes
router.get('/:id/submissions', authorizeRoles('teacher', 'admin'), getAssignmentSubmissions);
router.post('/:id/submit', authorizeRoles('student'), submitAssignment);

// Submission grading
router.put('/submissions/:id/grade', authorizeRoles('teacher', 'admin'), gradeSubmission);

module.exports = router;
