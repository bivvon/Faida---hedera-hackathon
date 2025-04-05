const express = require('express');
const router = express.Router();
const marketDataService = require('../core/marketDataService');

// Get market overview
router.get('/overview', async (req, res) => {
  try {
    const overview = await marketDataService.getMarketOverview();
    res.json(overview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get token price
router.get('/tokens/:id/price', async (req, res) => {
  try {
    const price = await marketDataService.getTokenPrice(req.params.id);
    res.json({ price });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get NFT collection price
router.get('/nfts/:id/price', async (req, res) => {
  try {
    const price = await marketDataService.getNftPrice(req.params.id);
    res.json({ price });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get DeFi protocol price
router.get('/defi/:id/price', async (req, res) => {
  try {
    const price = await marketDataService.getDefiTokenPrice(req.params.id);
    res.json({ price });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get historical data
router.get('/tokens/:id/historical', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const historicalData = await marketDataService.getHistoricalData(req.params.id, days);
    res.json(historicalData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get DeFi protocols
router.get('/defi/protocols', async (req, res) => {
  try {
    const protocols = await marketDataService.getDefiProtocols();
    res.json(protocols);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get NFT collections
router.get('/nfts/collections', async (req, res) => {
  try {
    const collections = await marketDataService.getNftCollections();
    res.json(collections);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 