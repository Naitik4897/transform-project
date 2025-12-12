import { Redis } from '@upstash/redis';

let redisClient;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis for production (serverless-friendly)
    const upstashClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    // Wrap Upstash client to handle JSON serialization
    redisClient = {
      get: async (key) => {
        const value = await upstashClient.get(key);
        return value;
      },
      set: async (key, value, ttl) => {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttl) {
          return await upstashClient.setex(key, ttl, serialized);
        }
        return await upstashClient.set(key, serialized);
      },
      del: async (key) => {
        return await upstashClient.del(key);
      },
      setex: async (key, seconds, value) => {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        return await upstashClient.setex(key, seconds, serialized);
      },
    };
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