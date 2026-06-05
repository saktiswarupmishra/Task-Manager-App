import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencilAlt } from 'react-icons/hi';
import './TaskForm.css';

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="task-form-overlay" onClick={handleOverlayClick} id="task-form-overlay">
      <div className="task-form-modal" id="task-form-modal">
        <h3 className="task-form-title">
          {isEditing ? <HiOutlinePencilAlt size={22} /> : <HiOutlinePlus size={22} />}
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="task-form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="task-form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              className="form-input"
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div className="task-form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="task-form-group">
            <label className="form-label" htmlFor="task-duedate">Due Date</label>
            <input
              id="task-duedate"
              name="dueDate"
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          {error && <p className="task-form-error">{error}</p>}

          <div className="task-form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} id="task-form-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} id="task-form-submit">
              {submitting && <span className="spinner" style={{ width: 14, height: 14 }}></span>}
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
