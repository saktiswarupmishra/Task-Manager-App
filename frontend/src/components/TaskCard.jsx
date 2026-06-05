import { HiOutlinePencil, HiOutlineTrash, HiCheck, HiOutlineClock } from 'react-icons/hi';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, provided, isDragging }) => {
  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffMs = due - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (task.status === 'completed') {
      return { label: due.toLocaleDateString(), className: '' };
    }
    if (diffMs < 0) {
      return { label: `Overdue`, className: 'overdue' };
    }
    if (diffHours <= 48) {
      return { label: `Due soon`, className: 'due-soon' };
    }
    return { label: due.toLocaleDateString(), className: '' };
  };

  const dueDateInfo = getDueDateInfo();
  const isCompleted = task.status === 'completed';

  const handleStatusCycle = () => {
    const statusMap = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
    };
    onToggleStatus(task._id, statusMap[task.status]);
  };

  return (
    <div
      className={`task-card priority-${task.priority} ${isCompleted ? 'completed' : ''} ${isDragging ? 'is-dragging' : ''}`}
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      id={`task-card-${task._id}`}
    >
      <div className="task-card-header">
        <button
          className={`task-card-status-btn ${isCompleted ? 'completed' : ''}`}
          onClick={handleStatusCycle}
          title={`Status: ${task.status}`}
          id={`task-status-${task._id}`}
        >
          {isCompleted && <HiCheck size={12} />}
        </button>
        <span className="task-card-title">{task.title}</span>
        <div className="task-card-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task" id={`task-edit-${task._id}`}>
            <HiOutlinePencil size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(task._id)} title="Delete task" id={`task-delete-${task._id}`} style={{ color: 'var(--accent-rose)' }}>
            <HiOutlineTrash size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-card-meta">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
        </div>
        {dueDateInfo && (
          <div className={`task-card-due ${dueDateInfo.className}`}>
            <HiOutlineClock size={12} />
            {dueDateInfo.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
