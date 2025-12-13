// Filename: ProtectedRoute.jsx
// Author: Naitik Maisuriya
// Description: Protected route wrapper for role-based access control

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, hasAnyRole, user } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    console.log('🔒 ProtectedRoute: Loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to /login');
    console.log('📍 From:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    console.log('🚫 ProtectedRoute: Insufficient role');
    console.log('User role:', user?.role, 'Required:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;