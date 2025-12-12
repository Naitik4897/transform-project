// Filename: authController.js
// Author: Naitik Maisuriya
// Description: Handles user authentication operations including register, login, logout

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redisClient from '../config/redis.js';
import { ROLES, CACHE_KEYS, CACHE_TTL } from '../utils/constants.js';

class AuthController {
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      const existingUser = await User.findOne({ email }).select('+password');
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email.',
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role: role || 'agent',
      });

      await user.save();

      const token = AuthController.generateToken(user);
      AuthController.setAuthCookie(res, token);

      await redisClient.set(
        CACHE_KEYS.USER(user._id),
        user.toJSON(),
        CACHE_TTL.USER
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.toJSON(),
          token: token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, isActive: true }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      user.lastLogin = new Date();
      await user.save();

      await redisClient.del(CACHE_KEYS.USER(user._id));

      const token = AuthController.generateToken(user);
      AuthController.setAuthCookie(res, token);

      await redisClient.set(
        CACHE_KEYS.USER(user._id),
        user.toJSON(),
        CACHE_TTL.USER
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          token: token,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async logout(req, res) {
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      };
      
      if (isProduction && process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN;
      }
      
      res.clearCookie('token', cookieOptions);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user data',
      });
    }
  }

  static generateToken(user) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    return token;
  }

  static setAuthCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // Must be true in production for SameSite=None
      sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days to match JWT expiry
      path: '/', // Ensure cookie is sent with all requests
    };
    
    // Don't set domain for Render deployments (they handle this automatically)
    
    res.cookie('token', token, cookieOptions);
  }
}

export default AuthController;