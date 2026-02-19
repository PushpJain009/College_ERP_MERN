// routes/feeRoutes.js
const express = require('express');
const {
  getFeeStructures,
  getFeeStructure,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getStudentFees,
  recordPayment,
  getPaymentHistory,
  getFeeReports
} = require('../controllers/feeController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// Fee structure routes
router
  .route('/')
  .get(getFeeStructures)
  .post(authorizeRoles('admin'), validate(validationSchemas.feeStructure), createFeeStructure);

router
  .route('/:id')
  .get(getFeeStructure)
  .put(authorizeRoles('admin'), validate(validationSchemas.feeStructure), updateFeeStructure)
  .delete(authorizeRoles('admin'), deleteFeeStructure);

// Student fee routes
router.get('/student/:studentId', getStudentFees);

// Payment routes
router.post('/payment', authorizeRoles('admin'), recordPayment);
router.get('/payments', authorizeRoles('admin'), getPaymentHistory);

// Reports
router.get('/reports', authorizeRoles('admin'), getFeeReports);

module.exports = router;
