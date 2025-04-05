const express = require('express');
const router = express.Router();
const riskAssessmentService = require('../core/riskAssessmentService');
const Investment = require('../models/Investment');

// Assess risk for a specific asset
router.get('/assets/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { assetType } = req.query;

    if (!assetType) {
      return res.status(400).json({ error: 'Asset type is required' });
    }

    const riskAssessment = await riskAssessmentService.assessAssetRisk(tokenId, assetType);
    res.json(riskAssessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assess risk for a portfolio
router.get('/portfolios/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const investments = await Investment.find({ portfolioId });

    if (!investments.length) {
      return res.status(404).json({ error: 'No investments found for this portfolio' });
    }

    const riskAssessment = await riskAssessmentService.assessPortfolioRisk(portfolioId, investments);
    res.json(riskAssessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get risk factors configuration
router.get('/factors', (req, res) => {
  try {
    res.json(riskAssessmentService.riskFactors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 