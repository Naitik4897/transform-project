// Filename: App.jsx
// Author: Naitik Maisuriya
// Description: Main application component with routing configuration

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SimpleAdminDashboard from './components/dashboard/SimpleAdminDashboard';
import SimpleQADashboard from './components/dashboard/SimpleQADashboard';
import SimpleAgentDashboard from './components/dashboard/SimpleAgentDashboard';
import { ROLES } from './utils/constants';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <AppLayout>
                    <SimpleAdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/qa"
              element={
                <ProtectedRoute allowedRoles={[ROLES.QA]}>
                  <AppLayout>
                    <SimpleQADashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute allowedRoles={[ROLES.AGENT]}>
                  <AppLayout>
                    <SimpleAgentDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root based on auth status */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Redirect manager to admin dashboard */}
            <Route path="/manager" element={<Navigate to="/admin" replace />} />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a href="/" className="btn-primary">Go to Dashboard</a>
                </div>
              </div>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;