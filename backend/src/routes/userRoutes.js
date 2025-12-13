// Filename: userRoutes.js
// Author: Naitik Maisuriya
// Description: User management routes with comprehensive CRUD operations

import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate, userValidation } from '../utils/validators.js';
import { ROLES } from '../utils/constants.js';

router.use(authenticate);

// Admin and Manager can view all users
router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  UserController.getAllUsers
);

// Admin and Manager can view specific user
router.get(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  UserController.getUserById
);

// Admin and Manager can update users
router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validate(userValidation.updateUser),
  UserController.updateUser
);

// Only Admin can delete users
router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  UserController.deleteUser
);

// Admin and Manager can assign agents to QA
router.post(
  '/assign-qa',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  UserController.assignAgentToQA
);

// QA can view their team tasks
router.get(
  '/qa/tasks',
  authorize(ROLES.QA),
  UserController.getQATasks
);

// Agent can view their assigned tasks
router.get(
  '/agent/tasks',
  authorize(ROLES.AGENT),
  UserController.getAgentTasks
);

export default router;