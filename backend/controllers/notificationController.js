// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    $or: [
      { 'recipients.user': req.user.id },
      { recipientRole: req.user.role },
      { recipientRole: 'all' }
    ],
    isActive: true
  })
    .populate('sender', 'name email')
    .populate('department', 'name code')
    .sort('-createdAt')
    .limit(50);

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)
    .populate('sender', 'name email');

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin/Teacher
exports.createNotification = asyncHandler(async (req, res, next) => {
  req.body.sender = req.user.id;

  // If recipientRole is specified, find all users with that role
  if (req.body.recipientRole && req.body.recipientRole !== 'specific') {
    let users;
    if (req.body.recipientRole === 'all') {
      users = await User.find();
    } else {
      users = await User.find({ role: req.body.recipientRole });
    }

    req.body.recipients = users.map(user => ({
      user: user._id,
      read: false
    }));
  }

  const notification = await Notification.create(req.body);

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
exports.updateNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  await notification.markAsRead(req.user.id);

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Get unread count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    {
      'recipients.user': req.user.id,
      'recipients.read': false
    },
    {
      $set: {
        'recipients.$.read': true,
        'recipients.$.readAt': Date.now()
      }
    }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});
