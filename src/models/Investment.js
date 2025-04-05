const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
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
  assetType: {
    type: String,
    enum: ['token', 'nft', 'defi_pool', 'real_estate', 'bond', 'stock'],
    required: true
  },
  tokenId: String, // Hedera token ID if applicable
  contractId: String, // Smart contract ID if applicable
  amount: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  currentPrice: Number,
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'staked', 'locked'],
    default: 'active'
  },
  performance: {
    roi: Number, // Return on Investment
    yield: Number, // Current yield if staked/lending
    apy: Number // Annual Percentage Yield
  },
  metadata: {
    name: String,
    description: String,
    assetClass: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }
});

// Calculate ROI
investmentSchema.methods.calculateROI = function() {
  if (this.currentPrice && this.purchasePrice) {
    return ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100;
  }
  return 0;
};

// Update current price and performance metrics
investmentSchema.methods.updateMetrics = async function(currentPrice) {
  this.currentPrice = currentPrice;
  this.performance.roi = this.calculateROI();
  this.lastUpdated = new Date();
  await this.save();
};

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment; 