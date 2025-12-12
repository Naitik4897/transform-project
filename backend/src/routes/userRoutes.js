// Filename: userRoutes.js
// Author: Naitik Maisuriya
// Description: User management routes with comprehensive CRUD operations

import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import { authenticate, authorize, checkPermission } from '../middlewares/auth.js';
import { validate, userValidation } from '../utils/validators.js';
import { ROLES } from '../utils/constants.js';

router.use(authenticate);


router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  checkPermission('view_users'),
  UserController.getAllUsers
);

router.get(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  checkPermission('view_users'),
  UserController.getUserById
);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  checkPermission('update_users'),
  validate(userValidation.updateUser),
  UserController.updateUser
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  checkPermission('delete_users'),
  UserController.deleteUser
);

router.post(
  '/assign-qa',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  checkPermission('assign_qa'),
  UserController.assignAgentToQA
);

router.get(
  '/qa/tasks',
  authorize(ROLES.QA),
  checkPermission('view_team_tasks'),
  UserController.getQATasks
);

router.get(
  '/agent/tasks',
  authorize(ROLES.AGENT),
  checkPermission('view_assigned_tasks'),
  UserController.getAgentTasks
);

export default router;