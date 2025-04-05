const express = require('express');
const router = express.Router();
const portfolioService = require('../core/portfolioService');
const validationService = require('../core/validationService');

// Create a new portfolio
router.post('/', async (req, res) => {
  try {
    const { error } = validationService.validate('portfolio', req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const portfolio = await portfolioService.createPortfolio(req.user.id, req.body);
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all portfolios for the user
router.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioService.getUserPortfolios(req.user.id);
    res.json(portfolios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific portfolio
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await portfolioService.getPortfolio(req.params.id, req.user.id);
    res.json(portfolio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a portfolio
router.put('/:id', async (req, res) => {
  try {
    const { error } = validationService.validate('portfolio', req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const portfolio = await portfolioService.updatePortfolio(req.params.id, req.user.id, req.body);
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get portfolio performance
router.get('/:id/performance', async (req, res) => {
  try {
    const performance = await portfolioService.calculatePortfolioPerformance(req.params.id, req.user.id);
    res.json(performance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rebalance portfolio
router.post('/:id/rebalance', async (req, res) => {
  try {
    const { error } = validationService.validate('portfolioAllocation', req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const rebalancing = await portfolioService.rebalancePortfolio(req.params.id, req.user.id, req.body);
    res.json(rebalancing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 