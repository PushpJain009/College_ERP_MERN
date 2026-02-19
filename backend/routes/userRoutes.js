// routes/userRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateDetails,
  updatePassword,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validate(validationSchemas.userRegister), registerUser);
router.post('/login', validate(validationSchemas.userLogin), loginUser);

// Protected routes (authenticated users)
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

// Admin only routes
router
  .route('/')
  .get(protect, authorizeRoles('admin'), getUsers)
  .post(protect, authorizeRoles('admin'), validate(validationSchemas.userRegister), createUser);

router
  .route('/:id')
  .get(protect, authorizeRoles('admin'), getUser)
  .put(protect, authorizeRoles('admin'), updateUser)
  .delete(protect, authorizeRoles('admin'), deleteUser);

module.exports = router;

