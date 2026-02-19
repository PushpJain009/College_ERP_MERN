// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add notification title'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please add notification message'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'announcement'],
    default: 'info'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  recipientRole: {
    type: String,
    enum: ['all', 'student', 'teacher', 'admin', 'specific'],
    default: 'all'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  semester: Number,
  link: String, // Optional link for redirect
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Mark notification as read
notificationSchema.methods.markAsRead = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient) {
    recipient.read = true;
    recipient.readAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('User not found in recipients'));
};

// Get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  const notifications = await this.find({
    'recipients.user': userId,
    'recipients.read': false,
    isActive: true
  });
  return notifications.length;
};

module.exports = mongoose.model('Notification', notificationSchema);
