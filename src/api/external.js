const express = require('express');
const router = express.Router();
const externalApiService = require('../core/externalApiService');

// Get market data
router.get('/market', async (req, res) => {
  try {
    const { symbols } = req.query;
    const data = await externalApiService.getMarketData(
      symbols ? symbols.split(',') : undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get DeFi metrics
router.get('/defi', async (req, res) => {
  try {
    const data = await externalApiService.getDeFiMetrics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get token price
router.get('/token/:address/price', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain } = req.query;
    const data = await externalApiService.getTokenPrice(address, chain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get NFT metadata
router.get('/nft/:address/:tokenId', async (req, res) => {
  try {
    const { address, tokenId } = req.params;
    const { chain } = req.query;
    const data = await externalApiService.getNFTMetadata(address, tokenId, chain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical data
router.get('/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days } = req.query;
    const data = await externalApiService.getHistoricalData(
      symbol,
      days ? parseInt(days) : undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gas prices
router.get('/gas/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const data = await externalApiService.getGasPrices(chain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get token balances
router.get('/balances/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain } = req.query;
    const data = await externalApiService.getTokenBalances(address, chain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get NFTs
router.get('/nfts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain } = req.query;
    const data = await externalApiService.getNFTs(address, chain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 