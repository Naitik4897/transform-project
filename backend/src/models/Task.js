// Filename: Task.js
// Author: Naitik Maisuriya
// Description: Mongoose schema for Task model with validation and indexes

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Task title must be at least 3 characters'],
    maxlength: [200, 'Task title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user'],
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must have an assigner'],
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  qaReviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  qaStatus: {
    type: String,
    enum: ['pending-review', 'approved', 'needs-revision', null],
    default: null,
  },
}, {
  timestamps: true,
});

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ qaReviewer: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;