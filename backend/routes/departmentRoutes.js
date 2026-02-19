// routes/departmentRoutes.js
const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// Public routes
router.get('/', getDepartments);
router.get('/:id', getDepartment);

// Protected routes (Admin only)
router.use(protect);
router.use(authorizeRoles('admin'));

router.post('/', validate(validationSchemas.department), createDepartment);
router.put('/:id', validate(validationSchemas.department), updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
