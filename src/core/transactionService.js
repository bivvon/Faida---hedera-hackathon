const mongoose = require('mongoose');
const Investment = require('../models/Investment');
const Portfolio = require('../models/Portfolio');
const validationService = require('./validationService');
const monitoringService = require('./monitoringService');
const externalApiService = require('./externalApiService');

class TransactionService {
  constructor() {
    this.transactionTypes = {
      BUY: 'buy',
      SELL: 'sell',
      STAKE: 'stake',
      UNSTAKE: 'unstake',
      TRANSFER: 'transfer'
    };

    this.transactionStatus = {
      PENDING: 'pending',
      COMPLETED: 'completed',
      FAILED: 'failed',
      CANCELLED: 'cancelled'
    };
  }

  async createTransaction(userId, data) {
    try {
      const { error } = validationService.validate('transaction', data);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const transaction = new Transaction({
        userId,
        ...data,
        status: this.transactionStatus.PENDING,
        timestamp: new Date()
      });

      await transaction.save();
      monitoringService.logTransactionCreation(transaction);
      return transaction;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async executeTransaction(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== this.transactionStatus.PENDING) {
        throw new Error('Transaction is not in pending state');
      }

      // Get current market price
      const marketPrice = await this.getMarketPrice(transaction.assetType, transaction.tokenId);
      
      // Update transaction with market price
      transaction.marketPrice = marketPrice;
      transaction.status = this.transactionStatus.COMPLETED;
      transaction.completedAt = new Date();

      // Update portfolio and investment records
      await this.updatePortfolioAndInvestment(transaction);

      await transaction.save();
      monitoringService.logTransactionCompletion(transaction);
      return transaction;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getMarketPrice(assetType, tokenId) {
    try {
      switch (assetType) {
        case 'crypto':
          return await externalApiService.getTokenPrice(tokenId);
        case 'nft':
          return await externalApiService.getNftPrice(tokenId);
        case 'defi':
          return await externalApiService.getDefiTokenPrice(tokenId);
        default:
          throw new Error('Unsupported asset type');
      }
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async updatePortfolioAndInvestment(transaction) {
    try {
      const portfolio = await Portfolio.findById(transaction.portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      let investment = await Investment.findOne({
        portfolioId: transaction.portfolioId,
        tokenId: transaction.tokenId
      });

      switch (transaction.type) {
        case this.transactionTypes.BUY:
          if (!investment) {
            investment = new Investment({
              userId: transaction.userId,
              portfolioId: transaction.portfolioId,
              assetType: transaction.assetType,
              tokenId: transaction.tokenId,
              amount: transaction.amount,
              purchasePrice: transaction.marketPrice,
              currentPrice: transaction.marketPrice,
              purchaseDate: new Date()
            });
          } else {
            const totalAmount = investment.amount + transaction.amount;
            const averagePrice = ((investment.amount * investment.purchasePrice) + 
                                (transaction.amount * transaction.marketPrice)) / totalAmount;
            
            investment.amount = totalAmount;
            investment.purchasePrice = averagePrice;
            investment.currentPrice = transaction.marketPrice;
          }
          break;

        case this.transactionTypes.SELL:
          if (!investment || investment.amount < transaction.amount) {
            throw new Error('Insufficient balance');
          }
          investment.amount -= transaction.amount;
          if (investment.amount === 0) {
            investment.status = 'sold';
          }
          break;

        case this.transactionTypes.STAKE:
          if (!investment || investment.amount < transaction.amount) {
            throw new Error('Insufficient balance');
          }
          investment.amount -= transaction.amount;
          investment.stakedAmount = (investment.stakedAmount || 0) + transaction.amount;
          investment.status = 'staked';
          break;

        case this.transactionTypes.UNSTAKE:
          if (!investment || (investment.stakedAmount || 0) < transaction.amount) {
            throw new Error('Insufficient staked amount');
          }
          investment.amount += transaction.amount;
          investment.stakedAmount -= transaction.amount;
          if (investment.stakedAmount === 0) {
            investment.status = 'active';
          }
          break;
      }

      await investment.save();
      await this.updatePortfolioAllocation(portfolio, investment);
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async updatePortfolioAllocation(portfolio, investment) {
    try {
      const totalValue = await this.calculatePortfolioValue(portfolio._id);
      const assetValue = investment.amount * investment.currentPrice;
      const newAllocation = (assetValue / totalValue) * 100;

      portfolio.allocations[investment.assetType] = newAllocation;
      await portfolio.save();
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async calculatePortfolioValue(portfolioId) {
    try {
      const investments = await Investment.find({ portfolioId });
      return investments.reduce((total, investment) => {
        return total + (investment.amount * investment.currentPrice);
      }, 0);
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getUserTransactions(userId, filters = {}) {
    try {
      const query = { userId };
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      if (filters.assetType) query.assetType = filters.assetType;
      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      return await Transaction.find(query)
        .sort({ timestamp: -1 })
        .limit(filters.limit || 50)
        .skip(filters.skip || 0);
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }
}

module.exports = new TransactionService(); 