const Joi = require('joi');
const { Types } = require('mongoose');

class ValidationService {
  constructor() {
    this.schemas = {
      user: {
        register: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          name: Joi.string().required(),
          riskProfile: Joi.string().valid('conservative', 'moderate', 'aggressive').required(),
          investmentGoals: Joi.array().items(Joi.string().valid('short_term', 'long_term', 'retirement', 'wealth_preservation')).required()
        }),
        login: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }),
        update: Joi.object({
          name: Joi.string(),
          riskProfile: Joi.string().valid('conservative', 'moderate', 'aggressive'),
          investmentGoals: Joi.array().items(Joi.string().valid('short_term', 'long_term', 'retirement', 'wealth_preservation')),
          notificationPreferences: Joi.object({
            email: Joi.boolean(),
            push: Joi.boolean(),
            sms: Joi.boolean()
          })
        })
      },
      wallet: {
        create: Joi.object({
          name: Joi.string().required(),
          type: Joi.string().valid('hedera', 'ethereum', 'bitcoin').required(),
          network: Joi.string().valid('mainnet', 'testnet').required()
        }),
        update: Joi.object({
          name: Joi.string(),
          isActive: Joi.boolean()
        })
      },
      investment: {
        create: Joi.object({
          portfolioId: Joi.string().required(),
          assetType: Joi.string().valid('crypto', 'nft', 'defi').required(),
          tokenId: Joi.string().when('assetType', {
            is: 'crypto',
            then: Joi.required()
          }),
          contractId: Joi.string().when('assetType', {
            is: 'nft',
            then: Joi.required()
          }),
          amount: Joi.number().min(0).required(),
          purchasePrice: Joi.number().min(0).required()
        }),
        update: Joi.object({
          amount: Joi.number().min(0),
          currentPrice: Joi.number().min(0),
          status: Joi.string().valid('active', 'sold', 'staked')
        })
      },
      defi: {
        stake: Joi.object({
          tokenId: Joi.string().required(),
          amount: Joi.number().min(0).required(),
          protocol: Joi.string().required(),
          duration: Joi.number().min(0)
        }),
        unstake: Joi.object({
          stakeId: Joi.string().required(),
          amount: Joi.number().min(0)
        })
      }
    };
  }

  validate(schemaName, data) {
    const schema = this.schemas[schemaName];
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }
    return schema.validate(data, { abortEarly: false });
  }

  validateObjectId(id) {
    return Types.ObjectId.isValid(id);
  }

  sanitizePortfolioData(data) {
    return {
      ...data,
      name: data.name?.trim(),
      description: data.description?.trim(),
      riskProfile: data.riskProfile?.toLowerCase(),
      investmentGoals: data.investmentGoals?.map(goal => goal.toLowerCase())
    };
  }

  sanitizeInvestmentData(data) {
    return {
      ...data,
      assetType: data.assetType?.toLowerCase(),
      status: data.status?.toLowerCase(),
      metadata: {
        ...data.metadata,
        notes: data.metadata?.notes?.trim()
      }
    };
  }

  validatePortfolioAllocation(allocations) {
    const total = Object.values(allocations).reduce((sum, value) => sum + value, 0);
    if (Math.abs(total - 100) > 0.01) {
      throw new Error('Portfolio allocations must sum to 100%');
    }
    return true;
  }

  validateRiskProfile(riskProfile, allocations) {
    const riskLevels = {
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

    const limits = riskLevels[riskProfile];
    if (!limits) return true;

    const cryptoAllocation = allocations.crypto || 0;
    const defiAllocation = allocations.defi || 0;
    const stableAllocation = allocations.stable || 0;

    if (cryptoAllocation > limits.maxCrypto) {
      throw new Error(`Crypto allocation exceeds ${riskProfile} risk profile limit`);
    }
    if (defiAllocation > limits.maxDefi) {
      throw new Error(`DeFi allocation exceeds ${riskProfile} risk profile limit`);
    }
    if (stableAllocation < limits.minStable) {
      throw new Error(`Stable allocation below ${riskProfile} risk profile minimum`);
    }

    return true;
  }
}

module.exports = new ValidationService(); 