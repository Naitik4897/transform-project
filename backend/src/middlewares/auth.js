// Filename: auth.js
// Author: Naitik Maisuriya
// Description: Authentication and authorization middleware for JWT verification and role-based access

import jwt from 'jsonwebtoken';
import { ROLES, PERMISSIONS } from '../utils/constants.js';
import redisClient from '../config/redis.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token found in cookies or headers');
      console.log('Cookies:', req.cookies);
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check blacklist - gracefully handle Redis errors
    try {
      const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: 'Token has been invalidated.',
        });
      }
    } catch (redisError) {
      console.error('Redis blacklist check error:', redisError);
      // Continue without blacklist check if Redis fails
    }

    req.user = decoded;
    
    // Try to get cached user data - don't fail if Redis is down
    try {
      const cachedUser = await redisClient.get(`user:${decoded.id}`);
      if (cachedUser) {
        req.user = { ...req.user, ...cachedUser };
      }
    } catch (redisError) {
      console.error('Redis get user error:', redisError);
      // Continue without cached data if Redis fails
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
      });
    }

    next();
  };
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = req.user.role;
    
    if (!PERMISSIONS[userRole] || !PERMISSIONS[userRole].includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions for this action. Required: ${permission}`,
      });
    }

    next();
  };
};

export {
  authenticate,
  authorize,
  checkPermission,
};