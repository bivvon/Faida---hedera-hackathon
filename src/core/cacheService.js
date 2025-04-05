const Redis = require('ioredis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async ttl(key) {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -2;
    }
  }

  async flush() {
    try {
      await this.redis.flushall();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  // Cache middleware for Express routes
  cacheMiddleware(ttl = 3600) {
    return async (req, res, next) => {
      const key = `cache:${req.originalUrl || req.url}`;
      
      try {
        const cachedData = await this.get(key);
        if (cachedData) {
          return res.json(cachedData);
        }

        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = (body) => {
          this.set(key, body, ttl);
          return originalJson.call(res, body);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  }

  // Rate limiting middleware
  rateLimitMiddleware(limit = 100, window = 60) {
    return async (req, res, next) => {
      const key = `ratelimit:${req.ip}`;
      
      try {
        const current = await this.redis.incr(key);
        if (current === 1) {
          await this.redis.expire(key, window);
        }

        if (current > limit) {
          return res.status(429).json({
            error: 'Too many requests',
            retryAfter: await this.redis.ttl(key)
          });
        }

        next();
      } catch (error) {
        console.error('Rate limit middleware error:', error);
        next();
      }
    };
  }
}

module.exports = new CacheService(); 