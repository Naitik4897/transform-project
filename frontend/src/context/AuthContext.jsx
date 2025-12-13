// Filename: AuthContext.jsx
// Author: Naitik Maisuriya
// Description: Authentication context provider for managing user state

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { ROLES } from '../utils/constants';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state - check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth - checking for existing session...');
        console.log('Current URL:', window.location.href);
        
        // Always try to get current user - the httpOnly cookie will be sent automatically
        const response = await authAPI.getCurrentUser();
        console.log('📥 getCurrentUser response:', response);
        
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          console.log('✅ User authenticated:', response.data.user.email, 'Role:', response.data.user.role);
          console.log('✅ Session is valid - staying logged in');
        } else {
          console.log('❌ Invalid response - no user data');
          setUser(null);
        }
      } catch (error) {
        // If 401, user is not authenticated - this is expected
        if (error.response?.status === 401) {
          console.log('⚠️ No valid session (401) - user not authenticated');
          console.log('Error details:', error.response?.data);
        } else {
          console.error('❌ Auth initialization error:', error);
          console.error('Error status:', error.response?.status);
          console.error('Error data:', error.response?.data);
        }
        setUser(null);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Logging in user:', email);
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        console.log('✅ Login successful, user set:', response.data.user.email);
        return { success: true, role: response.data.user.role };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear state and redirect, even if API call fails
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      // Use a full page reload to /login to ensure clean state
      window.location.assign('/login');
    }
  };

  // Check if user has role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Get user permissions based on role
  const getPermissions = () => {
    if (!user?.role) return [];
    return ROLES[user.role.toUpperCase()]?.permissions || [];
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    getPermissions,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};