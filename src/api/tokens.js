const express = require('express');
const router = express.Router();
const tokenService = require('../core/tokenService');

// Create a new token
router.post('/create', async (req, res) => {
  try {
    const tokenParams = req.body;
    const tokenId = await tokenService.createToken(tokenParams);
    res.json({ tokenId: tokenId.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Associate token with an account
router.post('/associate', async (req, res) => {
  try {
    const { accountId, tokenId } = req.body;
    const receipt = await tokenService.associateToken(accountId, tokenId);
    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grant KYC for a token
router.post('/kyc', async (req, res) => {
  try {
    const { accountId, tokenId } = req.body;
    const receipt = await tokenService.grantKyc(accountId, tokenId);
    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint tokens
router.post('/mint', async (req, res) => {
  try {
    const { tokenId, amount } = req.body;
    const receipt = await tokenService.mintToken(tokenId, amount);
    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Burn tokens
router.post('/burn', async (req, res) => {
  try {
    const { tokenId, amount } = req.body;
    const receipt = await tokenService.burnToken(tokenId, amount);
    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 