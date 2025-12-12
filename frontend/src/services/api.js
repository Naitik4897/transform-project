import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    // You can add auth token here if not using cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Return the data directly (which contains success, data, message, etc.)
    return response.data;
  },
  async (error) => {
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized - but don't redirect if it's the /me endpoint (initial auth check)
    if (error.response?.status === 401) {
      // Only redirect if it's not the initial auth check
      if (!error.config?.url?.includes('/auth/me')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    // Don't show toast here since we're handling it in the components
    // Just reject with the error so components can handle it
    return Promise.reject(error);
  }
);

const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

const userAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getQATasks: (params) => api.get('/users/qa/tasks', { params }),
  getAgentTasks: (params) => api.get('/users/agent/tasks', { params }),
  assignAgentToQA: (data) => api.post('/users/assign-qa', data),
};

const taskAPI = {
  getAllTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export { api, authAPI, userAPI, taskAPI };