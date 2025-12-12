// Filename: constants.js
// Author: Naitik Maisuriya
// Description: Application constants for roles, permissions, task status, and cache configuration

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  QA: 'qa',
  AGENT: 'agent',
};

const PERMISSIONS = {
  [ROLES.ADMIN]: ['view_users', 'add_users', 'update_users', 'delete_users', 'view_all_tasks', 'add_tasks', 'update_tasks', 'delete_tasks', 'assign_qa'],
  [ROLES.MANAGER]: ['view_users', 'add_users', 'update_users', 'view_all_tasks', 'add_tasks', 'update_tasks', 'delete_tasks', 'assign_qa'],
  [ROLES.QA]: ['view_assigned_tasks', 'review_tasks', 'view_team_tasks'],
  [ROLES.AGENT]: ['view_assigned_tasks', 'update_task_status'],
};

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const CACHE_KEYS = {
  USER: (userId) => `user:${userId}`,
  USER_LIST: 'users:list',
  TASK: (taskId) => `task:${taskId}`,
  USER_TASKS: (userId) => `user:tasks:${userId}`,
};

const CACHE_TTL = {
  USER: 3600, // 1 hour
  USER_LIST: 300, // 5 minutes
  TASK: 1800, // 30 minutes
  USER_TASKS: 900, // 15 minutes
};

export {
  ROLES,
  PERMISSIONS,
  TASK_STATUS,
  TASK_PRIORITY,
  CACHE_KEYS,
  CACHE_TTL,
};