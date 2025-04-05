const { ethers } = require('ethers');

class WalletManager {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider();
  }

  verifySignature(message, signature, address) {
    try {
      const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  createWallet() {
    try {
      const wallet = ethers.Wallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }
  }

  signMessage(privateKey, message) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
      return wallet.signMessage(messageHash);
    } catch (error) {
      throw new Error(`Error signing message: ${error.message}`);
    }
  }
}

const walletManager = new WalletManager();
module.exports = walletManager; 