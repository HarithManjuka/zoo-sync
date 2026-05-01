// src/config/redis.js
const { Redis } = require("@upstash/redis");
require("dotenv").config();

/**
 * Upstash Redis Configuration for Rate Limiting
 */
class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initialize();
  }

  /**
   * Initialize Redis connection
   */
  initialize() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    console.log('[Redis] URL from env:', url ? '✓ Found' : '✗ Missing');
    console.log('[Redis] Token from env:', token ? '✓ Found' : '✗ Missing');

    if (!url || !token) {
      console.warn('⚠️ Upstash credentials missing. Rate limiting disabled.');
      return null;
    }

    try {
      this.client = new Redis({
        url: url,
        token: token,
      });
      this.isConnected = true;
      console.log('✅ Upstash Redis initialized for rate limiting');
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize Upstash Redis:', error.message);
      this.isConnected = false;
      return null;
    }
  }

  getClient() {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  isAvailable() {
    return this.isConnected && this.client !== null;
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;