const tf = require('@tensorflow/tfjs-node');
const Investment = require('../models/Investment');

class AIService {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Load or create the model
      this.model = await this.createModel();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing AI model:', error);
      throw error;
    }
  }

  async createModel() {
    // Create a simple neural network for portfolio optimization
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [10] // Input features: risk profile, goals, market conditions, etc.
    }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 6, // Output: asset allocation percentages
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  preprocessUserData(user) {
    // Convert user preferences to numerical features
    const riskScores = {
      conservative: 0.2,
      moderate: 0.5,
      aggressive: 0.8
    };

    const goalScores = {
      short_term: 0.3,
      long_term: 0.6,
      retirement: 0.8,
      wealth_preservation: 0.4
    };

    return {
      riskScore: riskScores[user.riskProfile] || 0.5,
      goalScores: user.investmentGoals.map(goal => goalScores[goal] || 0.5)
    };
  }

  async generatePortfolioRecommendation(user, marketConditions) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const userData = this.preprocessUserData(user);
      
      // Combine user preferences with market conditions
      const inputFeatures = tf.tensor2d([[
        userData.riskScore,
        ...userData.goalScores,
        ...this.processMarketConditions(marketConditions)
      ]]);

      // Generate prediction
      const prediction = await this.model.predict(inputFeatures).array();
      
      return this.processRecommendation(prediction[0]);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      throw error;
    }
  }

  processMarketConditions(conditions) {
    // Process market conditions into numerical features
    return [
      conditions.marketVolatility || 0.5,
      conditions.trendStrength || 0.5,
      conditions.economicIndicators || 0.5
    ];
  }

  processRecommendation(prediction) {
    // Convert model output to asset allocation recommendation
    const assetClasses = [
      'tokens',
      'real_estate',
      'defi_pools',
      'bonds',
      'stocks',
      'stable_assets'
    ];

    return assetClasses.map((asset, index) => ({
      assetClass: asset,
      allocation: Math.round(prediction[index] * 100),
      riskLevel: this.calculateRiskLevel(asset, prediction[index])
    }));
  }

  calculateRiskLevel(assetClass, allocation) {
    const riskWeights = {
      tokens: 0.8,
      real_estate: 0.5,
      defi_pools: 0.9,
      bonds: 0.3,
      stocks: 0.6,
      stable_assets: 0.1
    };

    const riskScore = riskWeights[assetClass] * allocation;
    if (riskScore < 0.3) return 'low';
    if (riskScore < 0.6) return 'medium';
    return 'high';
  }

  async updateModel(trainingData) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const { inputs, outputs } = this.preprocessTrainingData(trainingData);
      await this.model.fit(inputs, outputs, {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2
      });
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  }

  preprocessTrainingData(data) {
    // Convert historical performance data to training features
    // This is a simplified version - in production, you'd want more sophisticated preprocessing
    const inputs = [];
    const outputs = [];

    data.forEach(item => {
      inputs.push([
        item.riskScore,
        ...item.marketConditions,
        ...item.userPreferences
      ]);
      outputs.push(item.actualReturns);
    });

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs)
    };
  }
}

const aiService = new AIService();
module.exports = aiService; 