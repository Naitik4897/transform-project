// Filename: redis.js
// Author: Naitik Maisuriya
// Description: Redis client configuration for caching and session management

import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = null;
    this.connect();
  }

  async connect() {
    try {
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = process.env.REDIS_PORT || '6379';
      
      this.client = redis.createClient({
        url: `redis://${redisHost}:${redisPort}`,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  async set(key, value, expiry = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: expiry,
      });
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
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
      console.error('Redis del error:', error);
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

  async deletePattern(pattern) {
    try {
      if (!this.client) {
        return false;
      }
      const keys = await this.client.keys(pattern);
      if (keys && keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Redis deletePattern error:', error);
      return false;
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;