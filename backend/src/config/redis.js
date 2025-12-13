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
        try {
          const value = await upstashClient.get(key);
          return value;
        } catch (error) {
          console.error('Redis get error:', error);
          return null;
        }
      },
      set: async (key, value, ttl) => {
        try {
          const serialized = typeof value === 'string' ? value : JSON.stringify(value);
          if (ttl) {
            return await upstashClient.setex(key, ttl, serialized);
          }
          return await upstashClient.set(key, serialized);
        } catch (error) {
          console.error('Redis set error:', error);
          return null;
        }
      },
      del: async (key) => {
        try {
          return await upstashClient.del(key);
        } catch (error) {
          console.error('Redis del error:', error);
          return 0;
        }
      },
      setex: async (key, seconds, value) => {
        try {
          const serialized = typeof value === 'string' ? value : JSON.stringify(value);
          return await upstashClient.setex(key, seconds, serialized);
        } catch (error) {
          console.error('Redis setex error:', error);
          return null;
        }
      },
      exists: async (key) => {
        try {
          return await upstashClient.exists(key);
        } catch (error) {
          console.error('Redis exists error:', error);
          return 0;
        }
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
      exists: async (key) => {
        return cache.has(key) ? 1 : 0;
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
    setex: async (key, seconds, value) => {
      cache.set(key, value);
      setTimeout(() => cache.delete(key), seconds * 1000);
      return 'OK';
    },
    exists: async (key) => {
      return cache.has(key) ? 1 : 0;
    },
  };
}

export default redisClient;