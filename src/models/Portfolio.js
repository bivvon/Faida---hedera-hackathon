const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  riskProfile: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    required: true
  },
  investmentGoals: [{
    type: String,
    enum: ['short_term', 'long_term', 'retirement', 'wealth_preservation']
  }],
  allocations: {
    crypto: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    defi: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    stable: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    nft: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    other: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

// Ensure allocations sum to 100%
portfolioSchema.pre('save', function(next) {
  const total = Object.values(this.allocations).reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error('Portfolio allocations must sum to 100%');
  }
  this.updatedAt = new Date();
  next();
});

// Indexes
portfolioSchema.index({ userId: 1, name: 1 }, { unique: true });
portfolioSchema.index({ userId: 1, isActive: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 