const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['market', 'defi', 'hedera', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Methods
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  await this.save();
};

// Statics
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, read: false });
};

notificationSchema.statics.getRecentNotifications = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

notificationSchema.statics.createMarketNotification = async function(userId, data) {
  return this.create({
    userId,
    type: 'market',
    title: 'Market Update',
    message: data.message,
    priority: data.priority || 'medium',
    data
  });
};

notificationSchema.statics.createDeFiNotification = async function(userId, data) {
  return this.create({
    userId,
    type: 'defi',
    title: 'DeFi Update',
    message: data.message,
    priority: data.priority || 'medium',
    data
  });
};

notificationSchema.statics.createHederaNotification = async function(userId, data) {
  return this.create({
    userId,
    type: 'hedera',
    title: 'Hedera Update',
    message: data.message,
    priority: data.priority || 'medium',
    data
  });
};

notificationSchema.statics.createSystemNotification = async function(userId, data) {
  return this.create({
    userId,
    type: 'system',
    title: data.title,
    message: data.message,
    priority: data.priority || 'medium',
    data
  });
};

module.exports = mongoose.model('Notification', notificationSchema); 