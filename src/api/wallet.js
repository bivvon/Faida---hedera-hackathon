const express = require('express');
const router = express.Router();
const walletManager = require('../core/walletManager');
const { hederaClient } = require('../core/hederaClient');

// Create new wallet
router.post('/create', async (req, res) => {
  try {
    const wallet = walletManager.createWallet();
    const accountId = await hederaClient.createAccount(wallet.address);
    
    if (!accountId) {
      return res.status(500).json({ error: 'Failed to create Hedera account' });
    }

    res.json({
      address: wallet.address,
      privateKey: wallet.privateKey,
      hederaAccountId: accountId.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await hederaClient.getBalance(address);
    
    if (balance === null) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      address,
      balance: balance.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify signature
router.post('/verify', (req, res) => {
  try {
    const { message, signature, address } = req.body;
    const isValid = walletManager.verifySignature(message, signature, address);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 