const mongoose = require('mongoose');
const Investment = require('../models/Investment');
const validationService = require('./validationService');
const monitoringService = require('./monitoringService');

class PortfolioService {
  constructor() {
    this.riskProfiles = {
      conservative: {
        maxCrypto: 30,
        maxDefi: 20,
        minStable: 40
      },
      moderate: {
        maxCrypto: 60,
        maxDefi: 40,
        minStable: 20
      },
      aggressive: {
        maxCrypto: 80,
        maxDefi: 60,
        minStable: 10
      }
    };
  }

  async createPortfolio(userId, data) {
    try {
      const sanitizedData = validationService.sanitizePortfolioData(data);
      const portfolio = new Portfolio({
        userId,
        ...sanitizedData,
        allocations: this.calculateInitialAllocations(sanitizedData.riskProfile)
      });

      await portfolio.save();
      monitoringService.logPortfolioCreation(portfolio);
      return portfolio;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async updatePortfolio(portfolioId, userId, data) {
    try {
      const portfolio = await Portfolio.findOne({ _id: portfolioId, userId });
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const sanitizedData = validationService.sanitizePortfolioData(data);
      Object.assign(portfolio, sanitizedData);

      if (data.riskProfile && data.riskProfile !== portfolio.riskProfile) {
        portfolio.allocations = this.calculateInitialAllocations(data.riskProfile);
      }

      await portfolio.save();
      monitoringService.logPortfolioUpdate(portfolio);
      return portfolio;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getPortfolio(portfolioId, userId) {
    try {
      const portfolio = await Portfolio.findOne({ _id: portfolioId, userId });
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }
      return portfolio;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getUserPortfolios(userId) {
    try {
      return await Portfolio.find({ userId });
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async calculatePortfolioPerformance(portfolioId, userId) {
    try {
      const investments = await Investment.find({ portfolioId, userId });
      const portfolio = await this.getPortfolio(portfolioId, userId);

      const performance = {
        totalValue: 0,
        totalInvested: 0,
        totalReturn: 0,
        roi: 0,
        byAssetType: {},
        allocation: {}
      };

      for (const investment of investments) {
        const currentValue = investment.amount * investment.currentPrice;
        const investedValue = investment.amount * investment.purchasePrice;
        const returnValue = currentValue - investedValue;

        performance.totalValue += currentValue;
        performance.totalInvested += investedValue;
        performance.totalReturn += returnValue;

        if (!performance.byAssetType[investment.assetType]) {
          performance.byAssetType[investment.assetType] = {
            value: 0,
            invested: 0,
            return: 0
          };
        }

        performance.byAssetType[investment.assetType].value += currentValue;
        performance.byAssetType[investment.assetType].invested += investedValue;
        performance.byAssetType[investment.assetType].return += returnValue;
      }

      performance.roi = (performance.totalReturn / performance.totalInvested) * 100;

      // Calculate current allocations
      for (const [assetType, data] of Object.entries(performance.byAssetType)) {
        performance.allocation[assetType] = (data.value / performance.totalValue) * 100;
      }

      return performance;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async rebalancePortfolio(portfolioId, userId, targetAllocations) {
    try {
      validationService.validatePortfolioAllocation(targetAllocations);
      const portfolio = await this.getPortfolio(portfolioId, userId);
      validationService.validateRiskProfile(portfolio.riskProfile, targetAllocations);

      const currentPerformance = await this.calculatePortfolioPerformance(portfolioId, userId);
      const rebalancing = this.calculateRebalancing(currentPerformance.allocation, targetAllocations);

      portfolio.allocations = targetAllocations;
      await portfolio.save();

      monitoringService.logPortfolioRebalancing(portfolio, rebalancing);
      return rebalancing;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  calculateInitialAllocations(riskProfile) {
    const profile = this.riskProfiles[riskProfile];
    if (!profile) {
      throw new Error('Invalid risk profile');
    }

    return {
      crypto: profile.maxCrypto * 0.8, // 80% of max allocation
      defi: profile.maxDefi * 0.8, // 80% of max allocation
      stable: profile.minStable * 1.2, // 120% of min allocation
      nft: 5, // Fixed 5% allocation for NFTs
      other: 100 - (profile.maxCrypto * 0.8 + profile.maxDefi * 0.8 + profile.minStable * 1.2 + 5)
    };
  }

  calculateRebalancing(currentAllocation, targetAllocation) {
    const rebalancing = {
      trades: [],
      totalValue: 0
    };

    for (const [assetType, current] of Object.entries(currentAllocation)) {
      const target = targetAllocation[assetType] || 0;
      const difference = target - current;

      if (Math.abs(difference) > 0.01) { // Only consider differences > 0.01%
        rebalancing.trades.push({
          assetType,
          currentAllocation: current,
          targetAllocation: target,
          difference,
          action: difference > 0 ? 'buy' : 'sell',
          amount: Math.abs(difference)
        });
      }
    }

    return rebalancing;
  }
}

module.exports = new PortfolioService(); 