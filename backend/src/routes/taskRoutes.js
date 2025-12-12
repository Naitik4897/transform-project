// Filename: taskRoutes.js
// Author: Naitik Maisuriya
// Description: Task management routes with role-based access control

import express from 'express';
import TaskController from '../controllers/taskController.js';
import { authenticate, authorize, checkPermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);


router.post(
  '/',
  authorize('admin', 'manager'),
  checkPermission('add_tasks'),
  TaskController.createTask
);

router.get(
  '/',
  TaskController.getAllTasks
);

router.put(
  '/:id',
  authorize('admin', 'manager'),
  checkPermission('update_tasks'),
  TaskController.updateTask
);

router.delete(
  '/:id',
  authorize('admin'),
  checkPermission('delete_tasks'),
  TaskController.deleteTask
);

export default router;
