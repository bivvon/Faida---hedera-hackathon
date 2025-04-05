const express = require('express');
const router = express.Router();
const aiService = require('../core/aiService');
const Investment = require('../models/Investment');

// Get portfolio recommendations
router.get('/portfolio', async (req, res) => {
  try {
    const user = req.user;
    
    // Get current market conditions (this would come from external APIs in production)
    const marketConditions = {
      marketVolatility: 0.4,
      trendStrength: 0.6,
      economicIndicators: 0.7
    };

    const recommendation = await aiService.generatePortfolioRecommendation(
      user,
      marketConditions
    );

    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get investment recommendations for specific asset type
router.get('/assets/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const user = req.user;

    // Get user's current investments of this type
    const currentInvestments = await Investment.find({
      userId: user.id,
      assetType: type,
      status: 'active'
    });

    // Get market conditions for this asset type
    const marketConditions = {
      marketVolatility: 0.4,
      trendStrength: 0.6,
      economicIndicators: 0.7
    };

    const recommendation = await aiService.generatePortfolioRecommendation(
      user,
      marketConditions
    );

    // Filter recommendations for requested asset type
    const typeRecommendation = recommendation.find(r => r.assetClass === type);

    res.json({
      currentInvestments,
      recommendation: typeRecommendation,
      suggestedActions: generateSuggestedActions(currentInvestments, typeRecommendation)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rebalancing recommendations
router.get('/rebalance', async (req, res) => {
  try {
    const user = req.user;

    // Get current portfolio
    const currentInvestments = await Investment.find({
      userId: user.id,
      status: 'active'
    });

    // Generate new recommendations
    const marketConditions = {
      marketVolatility: 0.4,
      trendStrength: 0.6,
      economicIndicators: 0.7
    };

    const recommendation = await aiService.generatePortfolioRecommendation(
      user,
      marketConditions
    );

    // Calculate rebalancing needs
    const rebalancing = calculateRebalancing(currentInvestments, recommendation);

    res.json({
      currentAllocation: rebalancing.current,
      targetAllocation: rebalancing.target,
      suggestedTrades: rebalancing.trades
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateSuggestedActions(currentInvestments, recommendation) {
  // Calculate total current investment
  const totalInvested = currentInvestments.reduce(
    (sum, inv) => sum + (inv.amount * inv.currentPrice),
    0
  );

  // Calculate target investment based on recommendation
  const targetAmount = totalInvested * (recommendation.allocation / 100);

  // Calculate difference
  const currentAmount = currentInvestments.reduce(
    (sum, inv) => sum + (inv.amount * inv.currentPrice),
    0
  );
  const difference = targetAmount - currentAmount;

  if (Math.abs(difference) < totalInvested * 0.05) {
    return { action: 'hold', reason: 'Current allocation is within acceptable range' };
  }

  return {
    action: difference > 0 ? 'buy' : 'sell',
    amount: Math.abs(difference),
    reason: `Portfolio ${difference > 0 ? 'under-allocated' : 'over-allocated'} for this asset type`
  };
}

function calculateRebalancing(currentInvestments, recommendations) {
  const current = {};
  const target = {};
  const trades = [];

  // Calculate current allocation
  const totalValue = currentInvestments.reduce(
    (sum, inv) => sum + (inv.amount * inv.currentPrice),
    0
  );

  currentInvestments.forEach(inv => {
    const value = inv.amount * inv.currentPrice;
    current[inv.assetType] = (value / totalValue) * 100;
  });

  // Set target allocation from recommendations
  recommendations.forEach(rec => {
    target[rec.assetClass] = rec.allocation;
  });

  // Calculate needed trades
  Object.keys(target).forEach(assetType => {
    const currentAllocation = current[assetType] || 0;
    const targetAllocation = target[assetType];
    const difference = targetAllocation - currentAllocation;

    if (Math.abs(difference) > 1) { // 1% threshold for rebalancing
      trades.push({
        assetType,
        action: difference > 0 ? 'buy' : 'sell',
        percentage: Math.abs(difference),
        reason: `Rebalance to target allocation of ${targetAllocation}%`
      });
    }
  });

  return { current, target, trades };
}

module.exports = router; 