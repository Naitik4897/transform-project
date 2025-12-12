// Filename: Sidebar.jsx
// Author: Naitik Maisuriya
// Description: Application sidebar with navigation menu

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Shield,
  CheckSquare,
  Target,
  Calendar,
  MessageSquare,
  Bell
} from 'lucide-react';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      {
        path: getDashboardPath(),
        icon: LayoutDashboard,
        label: 'Dashboard',
        exact: true,
      },
    ];

    // Admin and Manager share the same navigation
    if (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER) {
      return [
        ...baseItems,
        {
          path: '/admin/users',
          icon: Users,
          label: 'User Management',
        },
        {
          path: '/admin/tasks',
          icon: FileText,
          label: 'Task Overview',
        },
        {
          path: '/admin/analytics',
          icon: BarChart3,
          label: 'Analytics',
        },
        // Only show settings for Admin
        ...(user.role === ROLES.ADMIN ? [{
          path: '/admin/settings',
          icon: Settings,
          label: 'System Settings',
        }] : []),
      ];
    }

    // QA role navigation
    if (user.role === ROLES.QA) {
      return [
        ...baseItems,
        {
          path: '/qa/reviews',
          icon: CheckSquare,
          label: 'Task Reviews',
        },
        {
          path: '/qa/standards',
          icon: Shield,
          label: 'QA Standards',
        },
        {
          path: '/qa/reports',
          icon: FileText,
          label: 'Quality Reports',
        },
      ];
    }

    // Agent role navigation
    if (user.role === ROLES.AGENT) {
      return [
        ...baseItems,
        {
          path: '/agent/tasks',
          icon: Target,
          label: 'My Tasks',
        },
        {
          path: '/agent/calendar',
          icon: Calendar,
          label: 'Calendar',
        },
        {
          path: '/agent/messages',
          icon: MessageSquare,
          label: 'Messages',
        },
      ];
    }

    return baseItems;
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case ROLES.ADMIN:
      case ROLES.MANAGER:
        return '/admin';
      case ROLES.QA:
        return '/qa';
      case ROLES.AGENT:
        return '/agent';
      default:
        return '/';
    }
  };

  const navItems = getNavItems();

  const getRoleColor = () => {
    if (!user) return 'bg-primary-600';
    
    switch (user.role) {
      case ROLES.ADMIN:
        return 'bg-red-600';
      case ROLES.MANAGER:
        return 'bg-yellow-600';
      case ROLES.QA:
        return 'bg-blue-600';
      case ROLES.AGENT:
        return 'bg-green-600';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 rounded-lg ${getRoleColor()} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {user ? user.firstName.charAt(0) : 'D'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <button className="flex items-center w-full p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
                Help & Support
              </button>
              <button className="flex items-center w-full p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Bell className="h-5 w-5 mr-3 text-gray-400" />
                Notifications
              </button>
              <div className="pt-2">
                <div className="text-xs text-gray-500 px-3">
                  © 2024 Dashboard. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;