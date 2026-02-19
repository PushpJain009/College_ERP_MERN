// routes/notificationRoutes.js
const express = require('express');
const {
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  getUnreadCount,
  markAllAsRead
} = require('../controllers/notificationController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate, validationSchemas } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// General routes
router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);

// CRUD routes
router.post(
  '/',
  authorizeRoles('admin', 'teacher'),
  validate(validationSchemas.notification),
  createNotification
);

router
  .route('/:id')
  .get(getNotification)
  .put(authorizeRoles('admin'), updateNotification)
  .delete(authorizeRoles('admin'), deleteNotification);

// Mark as read
router.put('/:id/read', markAsRead);

module.exports = router;
