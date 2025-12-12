import { Redis } from '@upstash/redis';

let redisClient;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis for production (serverless-friendly)
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('✅ Redis (Upstash) connected');
  } else {
    // Fallback to in-memory cache if Redis not configured
    console.warn('⚠️  Redis not configured - using in-memory cache');
    const cache = new Map();
    redisClient = {
      get: async (key) => cache.get(key) || null,
      set: async (key, value, options) => {
        cache.set(key, value);
        if (options?.ex) {
          setTimeout(() => cache.delete(key), options.ex * 1000);
        }
        return 'OK';
      },
      del: async (key) => {
        cache.delete(key);
        return 1;
      },
      setex: async (key, seconds, value) => {
        cache.set(key, value);
        setTimeout(() => cache.delete(key), seconds * 1000);
        return 'OK';
      },
    };
  }
} catch (error) {
  console.error('❌ Redis connection error:', error);
  // Fallback to in-memory cache
  const cache = new Map();
  redisClient = {
    get: async (key) => cache.get(key) || null,
    set: async (key, value) => {
      cache.set(key, value);
      return 'OK';
    },
    del: async (key) => {
      cache.delete(key);
      return 1;
    },
  };
}

export default redisClient;