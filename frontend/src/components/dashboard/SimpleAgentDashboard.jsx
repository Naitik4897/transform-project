// Filename: SimpleAgentDashboard.jsx
// Author: Naitik Maisuriya
// Description: Agent dashboard for viewing assigned tasks

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SimpleAgentDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAgentTasks();
      if (response.success) {
        setTasks(response.data.tasks || []);
      }
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.firstName} {user?.lastName}!</p>
        <p className="text-sm text-gray-500 mt-1">Your assigned tasks</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Assigned Tasks</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Task Title</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3 text-left">Assigned By</th>
                  <th className="border p-3 text-left">Priority</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border p-3 text-center text-gray-500">
                      No tasks assigned
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">{task.title}</td>
                      <td className="border p-3">{task.description || 'No description'}</td>
                      <td className="border p-3">
                        {task.assignedBy ? 
                          `${task.assignedBy.firstName} ${task.assignedBy.lastName}` : 
                          'Unknown'
                        }
                      </td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority?.toUpperCase()}
                        </span>
                      </td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                          {task.status?.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="border p-3">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Total Tasks: {tasks.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAgentDashboard;
