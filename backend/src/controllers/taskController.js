// Filename: taskController.js
// Author: Naitik Maisuriya
// Description: Handles task management operations including create, read, update, delete

import Task from '../models/Task.js';
import User from '../models/User.js';

class TaskController {
  static async createTask(req, res) {
    try {
      const { title, description, assignedTo, priority, dueDate, qaReviewer } = req.body;

      const agent = await User.findById(assignedTo);
      if (!agent || agent.role !== 'agent') {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent selected',
        });
      }

      const task = new Task({
        title,
        description,
        assignedTo,
        assignedBy: req.user.id,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        qaReviewer: qaReviewer || null,
        status: 'pending',
      });

      await task.save();
      await task.populate('assignedTo assignedBy qaReviewer', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Task assigned successfully',
        data: { task },
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async getAllTasks(req, res) {
    try {
      const { status, priority, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const query = {};
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('assignedTo assignedBy qaReviewer', 'firstName lastName email')
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
      console.error('Get all tasks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tasks',
      });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const task = await Task.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('assignedTo assignedBy qaReviewer', 'firstName lastName email');

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: { task },
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
      });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;

      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
      });
    }
  }
}

export default TaskController;
