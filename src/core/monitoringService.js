const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;
const { hederaClient } = require('./hederaClient');
const cacheService = require('./cacheService');

class MonitoringService {
  constructor() {
    this.logger = this.initializeLogger();
    this.metrics = {
      requests: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0,
      responseTimes: [],
      activeConnections: 0
    };

    this.startMetricsCollection();
  }

  initializeLogger() {
    const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    });

    return createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(
        timestamp(),
        colorize(),
        logFormat
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
      ]
    });
  }

  startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, 60000); // Collect metrics every minute
  }

  async collectMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        requests: this.metrics.requests,
        errors: this.metrics.errors,
        cacheHitRate: this.calculateCacheHitRate(),
        averageResponseTime: this.calculateAverageResponseTime(),
        activeConnections: this.metrics.activeConnections,
        systemMemory: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      };

      // Store metrics in cache
      await cacheService.set('system:metrics', metrics, 3600);

      // Log metrics
      this.logger.info('System metrics collected', metrics);

      // Reset counters
      this.metrics.requests = 0;
      this.metrics.errors = 0;
      this.metrics.responseTimes = [];
    } catch (error) {
      this.logger.error('Error collecting metrics:', error);
    }
  }

  calculateCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
  }

  calculateAverageResponseTime() {
    if (this.metrics.responseTimes.length === 0) return 0;
    const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0);
    return sum / this.metrics.responseTimes.length;
  }

  logRequest(req, res, next) {
    const start = Date.now();
    this.metrics.requests++;

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.metrics.responseTimes.push(duration);

      this.logger.info('Request completed', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
    });

    next();
  }

  logError(error, req, res, next) {
    this.metrics.errors++;

    this.logger.error('Error occurred', {
      error: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
      ip: req.ip
    });

    next(error);
  }

  logCacheHit(key) {
    this.metrics.cacheHits++;
    this.logger.debug('Cache hit', { key });
  }

  logCacheMiss(key) {
    this.metrics.cacheMisses++;
    this.logger.debug('Cache miss', { key });
  }

  logUserActivity(userId, action, details = {}) {
    this.logger.info('User activity', {
      userId,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  logDeFiActivity(chain, protocol, action, details = {}) {
    this.logger.info('DeFi activity', {
      chain,
      protocol,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  logHederaActivity(contractId, action, details = {}) {
    this.logger.info('Hedera activity', {
      contractId,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  async getMetrics() {
    const cachedMetrics = await cacheService.get('system:metrics');
    return cachedMetrics || {
      timestamp: new Date().toISOString(),
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      cacheHitRate: this.calculateCacheHitRate(),
      averageResponseTime: this.calculateAverageResponseTime(),
      activeConnections: this.metrics.activeConnections
    };
  }
}

module.exports = new MonitoringService(); 