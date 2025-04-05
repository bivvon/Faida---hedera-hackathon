const express = require('express');
const router = express.Router();
const defiService = require('../core/defiService');

// Get lending pool information
router.get('/lending/:chainId/:poolAddress', async (req, res) => {
  try {
    const { chainId, poolAddress } = req.params;
    const poolInfo = await defiService.getLendingPoolInfo(chainId, poolAddress);
    res.json(poolInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get yield farming information
router.get('/farming/:chainId/:farmAddress', async (req, res) => {
  try {
    const { chainId, farmAddress } = req.params;
    const farmInfo = await defiService.getYieldFarmingInfo(chainId, farmAddress);
    res.json(farmInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get DEX information
router.get('/dex/:chainId/:routerAddress', async (req, res) => {
  try {
    const { chainId, routerAddress } = req.params;
    const dexInfo = await defiService.getDEXInfo(chainId, routerAddress);
    res.json(dexInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Hedera DeFi information
router.get('/hedera/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    const hederaInfo = await defiService.getHederaDeFiInfo(contractId);
    res.json(hederaInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get optimal DeFi strategy
router.get('/strategy/:chainId', async (req, res) => {
  try {
    const { chainId } = req.params;
    const { userAddress, riskProfile } = req.query;
    
    if (!userAddress || !riskProfile) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const strategies = await defiService.calculateOptimalStrategy(
      chainId,
      userAddress,
      riskProfile
    );
    
    res.json({ strategies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 