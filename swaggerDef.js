module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Faida Investment Platform API',
      version: '1.0.0',
      description: 'API documentation for Faida Investment Platform',
      contact: {
        name: 'Faida Team',
        email: 'support@faida.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.faida.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Investment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            portfolioId: { type: 'string' },
            tokenId: { type: 'string' },
            assetType: { type: 'string', enum: ['crypto', 'nft', 'defi'] },
            amount: { type: 'number' },
            marketPrice: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            portfolioId: { type: 'string' },
            type: { type: 'string', enum: ['buy', 'sell', 'stake', 'unstake', 'transfer'] },
            assetType: { type: 'string', enum: ['crypto', 'nft', 'defi'] },
            tokenId: { type: 'string' },
            amount: { type: 'number' },
            marketPrice: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        RiskAssessment: {
          type: 'object',
          properties: {
            riskScore: { type: 'number' },
            riskLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            metrics: {
              type: 'object',
              properties: {
                volatility: { type: 'number' },
                liquidity: { type: 'number' },
                correlation: { type: 'number' },
                marketCap: { type: 'number' },
                age: { type: 'number' }
              }
            },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  apis: ['./src/api/*.js']
}; 