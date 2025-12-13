// Filename: TaskManagement.jsx
// Author: Naitik Maisuriya
// Description: Task management component for creating and assigning tasks

import { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [qas, setQAs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    qaReviewer: '',
    priority: 'medium',
    dueDate: '',
  });

  // QA assignment form state
  const [assignForm, setAssignForm] = useState({
    agentId: '',
    qaId: '',
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAllTasks();
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch agents and QAs
  const fetchUsers = async () => {
    try {
      const [agentsRes, qasRes] = await Promise.all([
        userAPI.getAllUsers({ role: 'agent', limit: 100 }),
        userAPI.getAllUsers({ role: 'qa', limit: 100 }),
      ]);
      setAgents(agentsRes.data.users || []);
      setQAs(qasRes.data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchUsers();
    }
  }, [user]);

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await taskAPI.createTask(taskForm);
      
      if (response.success) {
        toast.success('Task assigned successfully');
        setTasks([response.data.task, ...tasks]);
        setShowTaskModal(false);
        setTaskForm({
          title: '',
          description: '',
          assignedTo: '',
          qaReviewer: '',
          priority: 'medium',
          dueDate: '',
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Create task error:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Handle QA assignment
  const handleAssignQA = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userAPI.assignAgentToQA(assignForm);
      
      if (response.success) {
        toast.success('Agent assigned to QA successfully');
        setShowAssignModal(false);
        setAssignForm({ agentId: '', qaId: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Assign QA error:', error);
      toast.error(error.response?.data?.message || 'Failed to assign agent to QA');
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await taskAPI.updateTask(taskId, { status: newStatus });
      
      if (response.success) {
        toast.success('Task status updated');
        setTasks(tasks.map(t => t._id === taskId ? response.data.task : t));
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update task status');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
        <p className="text-gray-600 mt-2">Assign tasks to agents and manage team assignments</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Assign New Task
        </button>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🔗 Assign Agent to QA
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Task</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">QA Reviewer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No tasks assigned yet
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{task.assignedTo?.firstName} {task.assignedTo?.lastName}</div>
                    <div className="text-xs text-gray-500">{task.assignedTo?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {task.qaReviewer ? (
                      <>
                        <div className="text-sm">{task.qaReviewer?.firstName} {task.qaReviewer?.lastName}</div>
                        <div className="text-xs text-gray-500">{task.qaReviewer?.email}</div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No QA assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                      className={`px-2 py-1 text-xs font-semibold rounded border ${
                        task.status === 'completed' ? 'bg-green-50 text-green-800 border-green-300' :
                        task.status === 'in-progress' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                        task.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-gray-50 text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this task?')) {
                          taskAPI.deleteTask(task._id).then(() => {
                            toast.success('Task deleted');
                            fetchTasks();
                          }).catch(() => toast.error('Failed to delete task'));
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Assign New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Agent</label>
                <select
                  required
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.firstName} {agent.lastName} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">QA Reviewer (Optional)</label>
                <select
                  value={taskForm.qaReviewer}
                  onChange={(e) => setTaskForm({ ...taskForm, qaReviewer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select QA (Optional)</option>
                  {qas.map(qa => (
                    <option key={qa._id} value={qa._id}>
                      {qa.firstName} {qa.lastName} ({qa.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QA Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Assign Agent to QA</h2>
            <form onSubmit={handleAssignQA}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
                <select
                  required
                  value={assignForm.agentId}
                  onChange={(e) => setAssignForm({ ...assignForm, agentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.firstName} {agent.lastName} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select QA</label>
                <select
                  required
                  value={assignForm.qaId}
                  onChange={(e) => setAssignForm({ ...assignForm, qaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select QA</option>
                  {qas.map(qa => (
                    <option key={qa._id} value={qa._id}>
                      {qa.firstName} {qa.lastName} ({qa.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign to QA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
