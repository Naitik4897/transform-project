// Filename: authRoutes.js
// Author: Naitik Maisuriya
// Description: Authentication routes for user registration, login, logout

import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authController.js';
import { validate, authValidation } from '../utils/validators.js';
import { authenticate } from '../middlewares/auth.js';


router.post(
  '/register',
  validate(authValidation.register),
  AuthController.register
);

router.post(
  '/login',
  validate(authValidation.login),
  AuthController.login
);

router.post('/logout', AuthController.logout);

router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;