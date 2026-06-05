import { useState, useEffect, useCallback } from 'react';
import { HiViewGrid, HiViewList, HiPlus } from 'react-icons/hi';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SearchFilter from '../components/SearchFilter';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskBoard from '../components/TaskBoard';
import Dashboard from '../components/Dashboard';
import AIRecommendations from '../components/AIRecommendations';
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('board');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', sortBy: 'order' });

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.priority !== 'all') params.set('priority', filters.priority);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data) => {
    const res = await api.post('/tasks', data);
    setTasks(prev => [...prev, res.data.task]);
    toast.success('Task created!');
  };

  const handleUpdate = async (data) => {
    const res = await api.put(`/tasks/${editingTask._id}`, data);
    setTasks(prev => prev.map(t => t._id === editingTask._id ? res.data.task : t));
    toast.success('Task updated!');
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
    } catch { toast.error('Failed to update status'); }
  };

  const handleReorder = async (reorderData) => {
    // Optimistic update
    setTasks(prev => {
      const updated = [...prev];
      reorderData.forEach(r => {
        const idx = updated.findIndex(t => t._id === r.id);
        if (idx !== -1) { updated[idx] = { ...updated[idx], order: r.order, status: r.status }; }
      });
      return updated;
    });
    try { await api.put('/tasks/reorder', { tasks: reorderData }); }
    catch { toast.error('Failed to reorder'); fetchTasks(); }
  };

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };

  const handleFilterChange = useCallback((f) => { setFilters(f); }, []);

  return (
    <div className="tasks-page container">
      <div className="tasks-header">
        <h1>📋 My Tasks</h1>
        <div className="tasks-header-actions">
          <div className="view-toggle">
            <button className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} id="view-list">
              <HiViewList size={16} /> List
            </button>
            <button className={`view-toggle-btn ${view === 'board' ? 'active' : ''}`} onClick={() => setView('board')} id="view-board">
              <HiViewGrid size={16} /> Board
            </button>
          </div>
          <button className="btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }} id="add-task-header">
            <HiPlus size={16} /> Add Task
          </button>
        </div>
      </div>

      <div className="tasks-layout">
        <div className="tasks-main">
          <Dashboard />
          <SearchFilter onFilterChange={handleFilterChange} />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }}></div></div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">📝</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started!</p>
            </div>
          ) : view === 'board' ? (
            <TaskBoard tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} onReorder={handleReorder} />
          ) : (
            <div className="task-list">
              {tasks.map(t => (
                <TaskCard key={t._id} task={t} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
              ))}
            </div>
          )}
        </div>
        <div className="tasks-sidebar">
          <AIRecommendations />
        </div>
      </div>

      <button className="add-task-btn" onClick={() => { setEditingTask(null); setShowForm(true); }} title="Add Task" id="add-task-fab">
        <HiPlus />
      </button>

      {showForm && (
        <TaskForm task={editingTask} onSubmit={editingTask ? handleUpdate : handleCreate} onClose={() => { setShowForm(false); setEditingTask(null); }} />
      )}
    </div>
  );
};

export default TasksPage;
