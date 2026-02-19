// routes/examRoutes.js
const express = require('express');
const {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  publishExam
} = require('../controllers/examController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getExams)
  .post(authorizeRoles('teacher', 'admin'), validate(validationSchemas.exam), createExam);

router
  .route('/:id')
  .get(getExam)
  .put(authorizeRoles('teacher', 'admin'), validate(validationSchemas.exam), updateExam)
  .delete(authorizeRoles('admin'), deleteExam);

router.put('/:id/publish', authorizeRoles('teacher', 'admin'), publishExam);

module.exports = router;
