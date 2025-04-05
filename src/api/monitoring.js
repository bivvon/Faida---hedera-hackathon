const express = require('express');
const router = express.Router();
const monitoringService = require('../core/monitoringService');
const { protect, admin } = require('../api/auth');

// Get system metrics
router.get('/metrics', protect, admin, async (req, res) => {
  try {
    const metrics = await monitoringService.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get error logs
router.get('/logs/error', protect, admin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    // Implement log file reading with pagination
    res.json({ message: 'Error logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get combined logs
router.get('/logs/combined', protect, admin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    // Implement log file reading with pagination
    res.json({ message: 'Combined logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity logs
router.get('/logs/user/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    // Implement user activity log retrieval
    res.json({ message: 'User activity logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get DeFi activity logs
router.get('/logs/defi', protect, admin, async (req, res) => {
  try {
    const { chain, protocol, limit = 100, offset = 0 } = req.query;
    // Implement DeFi activity log retrieval
    res.json({ message: 'DeFi activity logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Hedera activity logs
router.get('/logs/hedera', protect, admin, async (req, res) => {
  try {
    const { contractId, limit = 100, offset = 0 } = req.query;
    // Implement Hedera activity log retrieval
    res.json({ message: 'Hedera activity logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cache statistics
router.get('/cache', protect, admin, async (req, res) => {
  try {
    const metrics = await monitoringService.getMetrics();
    res.json({
      hitRate: metrics.cacheHitRate,
      hits: monitoringService.metrics.cacheHits,
      misses: monitoringService.metrics.cacheMisses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const metrics = await monitoringService.getMetrics();
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 