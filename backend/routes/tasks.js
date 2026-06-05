import { Hono } from 'hono';
import authMiddleware from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleStatus,
  reorderTasks,
  getAnalytics,
} from '../controllers/taskController.js';

const tasks = new Hono();

// All task routes are protected
tasks.use('/*', authMiddleware);

tasks.get('/analytics', getAnalytics);
tasks.get('/', getTasks);
tasks.post('/', createTask);
tasks.put('/reorder', reorderTasks);
tasks.put('/:id', updateTask);
tasks.delete('/:id', deleteTask);
tasks.patch('/:id/status', toggleStatus);

export default tasks;
