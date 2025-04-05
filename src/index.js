const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { hederaClient } = require('./core/hederaClient');
const { router: authRoutes, protect } = require('./api/auth');
const walletRoutes = require('./api/wallet');
const contractRoutes = require('./api/contracts');
const tokenRoutes = require('./api/tokens');
const recommendationRoutes = require('./api/recommendations');
const defiRoutes = require('./api/defi');
const notificationRoutes = require('./api/notifications');
const externalRoutes = require('./api/external');
const monitoringRoutes = require('./api/monitoring');
const portfolioRoutes = require('./api/portfolios');
const transactionRoutes = require('./api/transactions');
const marketRoutes = require('./api/market');
const riskRoutes = require('./api/risk');
const notificationService = require('./core/notificationService');
const cacheService = require('./core/cacheService');
const monitoringService = require('./core/monitoringService');
const securityService = require('./core/securityService');
const validationService = require('./core/validationService');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDef = require('../swaggerDef');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(securityService.getHelmetConfig());
app.use(cors(securityService.getCorsConfig()));
app.use(securityService.getRateLimiter());
app.use(express.json());

// Validation middleware
app.use((req, res, next) => {
  req.body = securityService.sanitizeInput(req.body);
  next();
});

// Monitoring middleware
app.use(monitoringService.logRequest.bind(monitoringService));
app.use(monitoringService.logError.bind(monitoringService));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', protect, walletRoutes);
app.use('/api/contracts', protect, contractRoutes);
app.use('/api/tokens', protect, tokenRoutes);
app.use('/api/recommendations', protect, recommendationRoutes);
app.use('/api/defi', protect, defiRoutes);
app.use('/api/notifications', protect, notificationRoutes);
app.use('/api/external', protect, cacheService.cacheMiddleware(300), externalRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/portfolios', protect, portfolioRoutes);
app.use('/api/transactions', protect, transactionRoutes);
app.use('/api/market', protect, marketRoutes);
app.use('/api/risk', protect, riskRoutes);

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerDef);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Faida Backend API',
    network: 'Hedera Testnet',
    status: 'operational',
    endpoints: {
      auth: '/api/auth',
      wallet: '/api/wallet',
      contracts: '/api/contracts',
      tokens: '/api/tokens',
      recommendations: '/api/recommendations',
      defi: '/api/defi',
      notifications: '/api/notifications',
      external: '/api/external',
      monitoring: '/api/monitoring',
      portfolios: '/api/portfolios',
      transactions: '/api/transactions',
      market: '/api/market',
      risk: '/api/risk'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  monitoringService.logError(err, req, res, next);
  
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});

// Initialize WebSocket server
notificationService.initialize(server); 