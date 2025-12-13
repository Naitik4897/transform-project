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
    // Log detailed error information for debugging
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - API might be down or unreachable');
      toast.error('Unable to connect to server. Please check your connection.');
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized - but don't redirect if it's the /me endpoint (initial auth check)
    if (error.response?.status === 401) {
      // Only redirect if it's not the initial auth check
      if (!error.config?.url?.includes('/auth/me')) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        sessionStorage.clear();
        window.location.assign('/login');
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
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