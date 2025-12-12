// Filename: authService.js
// Author: Naitik Maisuriya
// Description: Authentication service for handling user auth operations

import { authAPI } from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authAPI.getCurrentUser();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user data',
      };
    }
  },
};