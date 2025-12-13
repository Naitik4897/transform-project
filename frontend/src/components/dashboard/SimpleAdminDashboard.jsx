// Filename: SimpleAdminDashboard.jsx
// Author: Naitik Maisuriya
// Description: Admin dashboard for user management

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import TaskManagement from './TaskManagement';

const SimpleAdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'agent',
  });

  useEffect(() => {
    // Only fetch users if we have a valid user session
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from API...');
      const response = await userAPI.getAllUsers();
      console.log('Fetch users response:', response);
      
      if (response?.success && response?.data?.users) {
        console.log('Users loaded successfully:', response.data.users.length, 'users');
        setUsers(response.data.users);
      } else {
        console.error('Invalid response format:', response);
        toast.error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(formData);
      console.log('Add user response:', response);
      if (response?.success) {
        toast.success('User added successfully');
        
        // Optimistic update - add the new user to the list immediately
        const newUser = response.data?.user;
        if (newUser) {
          setUsers(prevUsers => [newUser, ...prevUsers]);
        }
        
        setShowAddModal(false);
        resetForm();
        
        // Fetch fresh data in background
        fetchUsers();
      } else {
        toast.error('Failed to add user');
      }
    } catch (error) {
      console.error('Add user error:', error);
      // Only show error if it's not a permission-related issue (since register doesn't need auth)
      if (error?.response?.status !== 403 && error?.response?.status !== 401) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add user';
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
      };
      const response = await userAPI.updateUser(selectedUser._id, updateData);
      console.log('Update user response:', response);
      if (response?.success) {
        toast.success('User updated successfully');
        setShowEditModal(false);
        resetForm();
        await fetchUsers(); // Wait for fetch to complete
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await userAPI.deleteUser(userId);
      console.log('Delete user response:', response);
      if (response?.success) {
        toast.success('User deleted successfully');
        await fetchUsers(); // Wait for fetch to complete
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setFormData({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      password: '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'agent',
    });
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {user?.role === 'admin' ? 'Admin' : 'Manager'} Dashboard
        </h1>
        <p className="text-gray-600">Welcome, {user?.firstName} {user?.lastName}!</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Task Management
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'tasks' && (user?.role === 'admin' || user?.role === 'manager') ? (
        <TaskManagement />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <button
              onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Role</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="border p-3 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="border p-3">{u.firstName} {u.lastName}</td>
                      <td className="border p-3">{u.email}</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' :
                          u.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'qa' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="border p-3">
                        {u.isActive ? (
                          <span className="text-green-600 font-semibold">Active</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="border p-3">
                        <button
                          onClick={() => openEditModal(u)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            disabled={u._id === user._id}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Password* (min 8 chars)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  minLength={8}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role*</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="agent">Agent</option>
                  <option value="qa">QA</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role*</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="agent">Agent</option>
                  <option value="qa">QA</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAdminDashboard;
