const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ethers } = require('ethers');
const { hederaClient } = require('./hederaClient');

class AuthService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider();
  }

  // Web3 Authentication
  async verifyWeb3Signature(message, signature, address) {
    try {
      const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying Web3 signature:', error);
      return false;
    }
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        address: user.address,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  // Hash password for OAuth users
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  // Verify password for OAuth users
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Create Hedera account for new user
  async createHederaAccount(publicKey) {
    try {
      const accountId = await hederaClient.createAccount(publicKey);
      return accountId;
    } catch (error) {
      console.error('Error creating Hedera account:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
module.exports = authService; 