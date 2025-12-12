// Filename: userController.js
// Author: Naitik Maisuriya
// Description: Handles user management and user-related operations

import User from '../models/User.js';
import Task from '../models/Task.js';
import redisClient from '../config/redis.js';
import { ROLES, CACHE_KEYS, CACHE_TTL } from '../utils/constants.js';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { role, page = 1, limit = 10, search = '' } = req.query;
      const skip = (page - 1) * limit;

      const query = { isActive: true };
      
      if (role && Object.values(ROLES).includes(role)) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password -__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        User.countDocuments(query),
      ]);

      const result = {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const cacheKey = CACHE_KEYS.USER(id);
      const cachedUser = await redisClient.get(cacheKey);
      
      if (cachedUser) {
        return res.status(200).json({
          success: true,
          fromCache: true,
          data: { user: cachedUser },
        });
      }

      const user = await User.findById(id).select('-password -__v');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      await redisClient.set(cacheKey, user.toJSON(), CACHE_TTL.USER);

      res.status(200).json({
        success: true,
        fromCache: false,
        data: { user: user.toJSON() },
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.user.id === id && updateData.role) {
        return res.status(403).json({
          success: false,
          message: 'You cannot change your own role',
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -__v');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user: user.toJSON() },
      });
    } catch (error) {
      console.error('Update user error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists. Please use a different email address.',
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (req.user.id === id) {
        return res.status(403).json({
          success: false,
          message: 'You cannot delete your own account',
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).select('-password -__v');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: { user: user.toJSON() },
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async getQATasks(req, res) {
    try {
      const qaId = req.user.id;
      const { status, page = 1, limit = 100 } = req.query;
      const skip = (page - 1) * limit;

      const query = { qaReviewer: qaId };
      
      if (status) {
        query.status = status;
      }

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('assignedTo', 'firstName lastName email')
          .populate('assignedBy', 'firstName lastName email')
          .populate('qaReviewer', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Task.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        data: {
          tasks,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Get QA tasks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch QA tasks',
      });
    }
  }

  static async getAgentTasks(req, res) {
    try {
      const agentId = req.user.id;
      const { status, page = 1, limit = 100 } = req.query;
      const skip = (page - 1) * limit;

      const query = { assignedTo: agentId };
      
      if (status) {
        query.status = status;
      }

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('assignedTo', 'firstName lastName email')
          .populate('assignedBy', 'firstName lastName email')
          .populate('qaReviewer', 'firstName lastName email')
          .sort({ priority: -1, dueDate: 1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Task.countDocuments(query),
      ]);

      const result = {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };

      res.status(200).json({
        success: true,
        fromCache: false,
        data: result,
      });
    } catch (error) {
      console.error('Get agent tasks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch agent tasks',
      });
    }
  }

  static async assignAgentToQA(req, res) {
    try {
      const { agentId, qaId } = req.body;

      const agent = await User.findById(agentId);
      if (!agent || agent.role !== 'agent') {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent selected',
        });
      }

      const qa = await User.findById(qaId);
      if (!qa || qa.role !== 'qa') {
        return res.status(400).json({
          success: false,
          message: 'Invalid QA selected',
        });
      }

      agent.assignedQA = qaId;
      await agent.save();

      res.status(200).json({
        success: true,
        message: 'Agent assigned to QA successfully',
        data: { agent: agent.toJSON() },
      });
    } catch (error) {
      console.error('Assign agent to QA error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign agent to QA',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

export default UserController;
