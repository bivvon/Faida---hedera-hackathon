const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Web3 fields
  address: {
    type: String,
    unique: true,
    sparse: true
  },
  hederaAccountId: String,
  publicKey: String,
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString()
  },

  // OAuth fields
  password: {
    type: String,
    select: false
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github']
  },
  providerId: String,

  // User preferences
  riskProfile: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  investmentGoals: [{
    type: String,
    enum: ['short_term', 'long_term', 'retirement', 'wealth_preservation']
  }],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    portfolioUpdates: { type: Boolean, default: true },
    marketAlerts: { type: Boolean, default: true }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 