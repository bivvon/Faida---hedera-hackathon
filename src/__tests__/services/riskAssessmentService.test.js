const riskAssessmentService = require('../../core/riskAssessmentService');
const marketDataService = require('../../core/marketDataService');

jest.mock('../../core/marketDataService');

describe('RiskAssessmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('assessAssetRisk', () => {
    it('should assess risk for a crypto asset', async () => {
      const mockHistoricalData = {
        prices: [[Date.now() - 86400000, 100], [Date.now(), 110]],
        totalVolumes: [[Date.now() - 86400000, 1000000], [Date.now(), 2000000]]
      };

      const mockMarketData = {
        marketCap: 1000000000,
        trendingCoins: [{ id: 'bitcoin', name: 'Bitcoin' }]
      };

      marketDataService.getHistoricalData.mockResolvedValue(mockHistoricalData);
      marketDataService.getMarketOverview.mockResolvedValue(mockMarketData);

      const result = await riskAssessmentService.assessAssetRisk('bitcoin', 'crypto');

      expect(result).toHaveProperty('riskScore');
      expect(result).toHaveProperty('riskLevel');
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('recommendations');
      expect(marketDataService.getHistoricalData).toHaveBeenCalledWith('bitcoin', 365);
      expect(marketDataService.getMarketOverview).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      marketDataService.getHistoricalData.mockRejectedValue(new Error('API Error'));

      await expect(riskAssessmentService.assessAssetRisk('bitcoin', 'crypto'))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('assessPortfolioRisk', () => {
    it('should assess risk for a portfolio', async () => {
      const mockInvestments = [
        { tokenId: 'bitcoin', assetType: 'crypto', amount: 1000 },
        { tokenId: 'ethereum', assetType: 'crypto', amount: 500 }
      ];

      const mockHistoricalData = {
        prices: [[Date.now() - 86400000, 100], [Date.now(), 110]],
        totalVolumes: [[Date.now() - 86400000, 1000000], [Date.now(), 2000000]]
      };

      const mockMarketData = {
        marketCap: 1000000000,
        trendingCoins: [{ id: 'bitcoin', name: 'Bitcoin' }]
      };

      marketDataService.getHistoricalData.mockResolvedValue(mockHistoricalData);
      marketDataService.getMarketOverview.mockResolvedValue(mockMarketData);

      const result = await riskAssessmentService.assessPortfolioRisk('portfolio1', mockInvestments);

      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('diversification');
      expect(result).toHaveProperty('concentration');
      expect(result).toHaveProperty('assets');
      expect(result).toHaveProperty('recommendations');
    });
  });

  describe('calculateRiskScore', () => {
    it('should calculate risk score based on metrics', () => {
      const metrics = {
        volatility: 0.3,
        liquidity: 2000000,
        correlation: 0.5,
        marketCap: 1000000000,
        age: 2
      };

      const score = riskAssessmentService.calculateRiskScore(metrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('determineRiskLevel', () => {
    it('should return low risk for scores <= 0.3', () => {
      expect(riskAssessmentService.determineRiskLevel(0.2)).toBe('low');
    });

    it('should return medium risk for scores <= 0.6', () => {
      expect(riskAssessmentService.determineRiskLevel(0.4)).toBe('medium');
    });

    it('should return high risk for scores > 0.6', () => {
      expect(riskAssessmentService.determineRiskLevel(0.7)).toBe('high');
    });
  });
}); 