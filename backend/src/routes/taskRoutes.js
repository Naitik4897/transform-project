// Filename: taskRoutes.js
// Author: Naitik Maisuriya
// Description: Task management routes with role-based access control

import express from 'express';
import TaskController from '../controllers/taskController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

// Admin and Manager can create tasks
router.post(
  '/',
  authorize('admin', 'manager'),
  TaskController.createTask
);

// All authenticated users can view tasks
router.get(
  '/',
  authorize('admin', 'manager', 'qa', 'agent'),
  TaskController.getAllTasks
);

// All authenticated users can update tasks
router.put(
  '/:id',
  authorize('admin', 'manager', 'qa', 'agent'),
  TaskController.updateTask
);

// Admin and Manager can delete tasks
router.delete(
  '/:id',
  authorize('admin', 'manager'),
  TaskController.deleteTask
);

export default router;
