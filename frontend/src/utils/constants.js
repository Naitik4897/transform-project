// Filename: constants.js
// Author: Naitik Maisuriya
// Description: Application constants for roles, permissions, and status

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  QA: 'qa',
  AGENT: 'agent',
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'view_users',
    'add_users',
    'update_users',
    'delete_users',
    'view_all_tasks',
    'manage_system',
  ],
  [ROLES.MANAGER]: [
    'view_users',
    'add_users',
    'update_users',
    'view_all_tasks',
    'assign_tasks',
    'view_reports',
  ],
  [ROLES.QA]: [
    'view_assigned_tasks',
    'review_tasks',
    'view_team_tasks',
    'update_qa_status',
    'view_qa_reports',
  ],
  [ROLES.AGENT]: [
    'view_assigned_tasks',
    'update_task_status',
    'submit_tasks',
    'view_performance',
  ],
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};