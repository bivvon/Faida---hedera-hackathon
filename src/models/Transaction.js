const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'stake', 'unstake', 'transfer'],
    required: true
  },
  assetType: {
    type: String,
    enum: ['crypto', 'nft', 'defi'],
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  marketPrice: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

// Indexes
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ portfolioId: 1, timestamp: -1 });
transactionSchema.index({ tokenId: 1, timestamp: -1 });
transactionSchema.index({ status: 1, timestamp: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 