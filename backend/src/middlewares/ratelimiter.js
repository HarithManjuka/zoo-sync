import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';

/**
 * Professional Rate Limiting Middleware
 * Protects API from abuse and DoS attacks
 */
class RateLimiterMiddleware {
  constructor() {
    this.ratelimit = null;
    this.initialize();
  }

  /**
   * Initialize rate limiter with Redis
   */
  initialize() {
    // Get credentials directly from process.env
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    console.log('[RateLimiter] Checking credentials...');
    console.log('[RateLimiter] URL exists:', !!redisUrl);
    console.log('[RateLimiter] Token exists:', !!redisToken);
    
    if (!redisUrl || !redisToken) {
      console.warn('⚠️ Upstash credentials missing. Rate limiting disabled.');
      console.warn('   Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env');
      return;
    }

    try {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });
      
      this.ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(60, "60 s"),
        analytics: true,
        prefix: "zoosync:ratelimit",
        timeout: 5000,
      });

      console.log('✅ Rate limiter configured: 60 requests per minute per IP');
    } catch (error) {
      console.error('❌ Failed to initialize rate limiter:', error.message);
    }
  }

  /**
   * Check if endpoint should be rate limited
   */
  shouldSkipRateLimit(req) {
    const whitelistedPaths = [
      '/health',
      '/api/test',
      '/api/public',
      '/favicon.ico'
    ];
    
    if (process.env.NODE_ENV === 'development') {
      return whitelistedPaths.includes(req.path);
    }
    
    return whitelistedPaths.includes(req.path);
  }

  /**
   * Main rate limiting middleware
   */
  async apply(req, res, next) {
    if (this.shouldSkipRateLimit(req)) {
      return next();
    }

    if (!this.ratelimit) {
      return next();
    }

    try {
      const identifier = this.getIdentifier(req);
      const result = await this.ratelimit.limit(identifier);
      
      res.setHeader('X-RateLimit-Limit', 60);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);
      
      if (!result.success) {
        console.warn(`Rate limit exceeded for ${identifier}`);
        return res.status(429).json({
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
          limit: 60,
          remaining: 0
        });
      }
      
      next();
      
    } catch (error) {
      console.error('Rate limiter error:', error.message);
      next();
    }
  }

  /**
   * Get identifier for rate limiting
   */
  getIdentifier(req) {
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               'anonymous';
    
    return ip.toString().replace(/^::ffff:/, '');
  }
}

// Create singleton instance
const rateLimiterMiddleware = new RateLimiterMiddleware();
export default (req, res, next) => rateLimiterMiddleware.apply(req, res, next);