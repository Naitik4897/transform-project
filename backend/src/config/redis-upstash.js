// Filename: redis-upstash.js
// Author: Naitik Maisuriya
// Description: Upstash Redis client configuration for serverless (Vercel compatible)
// This is an alternative to the standard Redis client, optimized for serverless environments

import { Redis } from '@upstash/redis';

class UpstashRedisClient {
  constructor() {
    this.client = null;
    this.connect();
  }

  connect() {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        // Use Upstash Redis (recommended for Vercel)
        this.client = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        console.log('✅ Connected to Upstash Redis');
      } else {
        console.log('⚠️ Upstash Redis credentials not found. Using mock Redis client.');
        this.client = new MockRedisClient();
      }
    } catch (error) {
      console.error('Failed to connect to Upstash Redis:', error);
      this.client = new MockRedisClient();
    }
  }

  async set(key, value, expiry = 3600) {
    try {
      if (expiry) {
        await this.client.set(key, JSON.stringify(value), { ex: expiry });
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async expire(key, seconds) {
    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      console.error('Redis expire error:', error);
      return false;
    }
  }

  async ttl(key) {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis ttl error:', error);
      return -1;
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis keys error:', error);
      return [];
    }
  }

  async flushall() {
    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error('Redis flushall error:', error);
      return false;
    }
  }

  // Rate limiting helper
  async incrementWithExpiry(key, expiry = 60) {
    try {
      const count = await this.client.incr(key);
      if (count === 1) {
        await this.client.expire(key, expiry);
      }
      return count;
    } catch (error) {
      console.error('Redis increment error:', error);
      return 0;
    }
  }
}

// Mock Redis client for development without Redis
class MockRedisClient {
  constructor() {
    this.store = new Map();
    console.log('⚠️ Using Mock Redis Client (in-memory only)');
  }

  async set(key, value, options) {
    this.store.set(key, { value, expiry: options?.ex ? Date.now() + options.ex * 1000 : null });
    return 'OK';
  }

  async get(key) {
    const data = this.store.get(key);
    if (!data) return null;
    if (data.expiry && Date.now() > data.expiry) {
      this.store.delete(key);
      return null;
    }
    return data.value;
  }

  async del(key) {
    this.store.delete(key);
    return 1;
  }

  async exists(key) {
    return this.store.has(key) ? 1 : 0;
  }

  async expire(key, seconds) {
    const data = this.store.get(key);
    if (data) {
      data.expiry = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }

  async ttl(key) {
    const data = this.store.get(key);
    if (!data) return -2;
    if (!data.expiry) return -1;
    return Math.floor((data.expiry - Date.now()) / 1000);
  }

  async keys(pattern) {
    return Array.from(this.store.keys()).filter(k => {
      if (pattern === '*') return true;
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(k);
    });
  }

  async flushall() {
    this.store.clear();
    return 'OK';
  }

  async incr(key) {
    const data = this.store.get(key);
    const newValue = data ? parseInt(data.value) + 1 : 1;
    this.store.set(key, { value: newValue.toString(), expiry: data?.expiry || null });
    return newValue;
  }
}

const upstashRedisClient = new UpstashRedisClient();

export default upstashRedisClient;
