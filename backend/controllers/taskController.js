import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendTaskCompleted } from '../utils/email.js';

// GET /api/tasks
export const getTasks = async (c) => {
  try {
    const user = c.get('user');
    const url = new URL(c.req.url);

    // Query params
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const sortBy = url.searchParams.get('sortBy') || 'order';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    // Build filter
    const filter = { user: user._id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter).sort(sort);

    return c.json({ tasks });
  } catch (error) {
    console.error('GetTasks error:', error);
    return c.json({ message: 'Server error fetching tasks.' }, 500);
  }
};

// POST /api/tasks
export const createTask = async (c) => {
  try {
    const user = c.get('user');
    const { title, description, priority, dueDate, status } = await c.req.json();

    if (!title) {
      return c.json({ message: 'Task title is required.' }, 400);
    }

    // Get max order for user's tasks
    const maxOrder = await Task.findOne({ user: user._id }).sort({ order: -1 }).select('order');
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: status || 'pending',
      order,
      user: user._id,
    });

    return c.json({ message: 'Task created', task }, 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return c.json({ message: messages.join(', ') }, 400);
    }
    console.error('CreateTask error:', error);
    return c.json({ message: 'Server error creating task.' }, 500);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (c) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const updates = await c.req.json();

    const task = await Task.findOne({ _id: taskId, user: user._id });
    if (!task) {
      return c.json({ message: 'Task not found.' }, 404);
    }

    const previousStatus = task.status;

    // Apply updates
    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'order'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    await task.save();

    // Send email if task was just completed
    if (previousStatus !== 'completed' && task.status === 'completed') {
      sendTaskCompleted(task, user.email).catch(() => {});
    }

    return c.json({ message: 'Task updated', task });
  } catch (error) {
    console.error('UpdateTask error:', error);
    return c.json({ message: 'Server error updating task.' }, 500);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (c) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');

    const task = await Task.findOneAndDelete({ _id: taskId, user: user._id });
    if (!task) {
      return c.json({ message: 'Task not found.' }, 404);
    }

    return c.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('DeleteTask error:', error);
    return c.json({ message: 'Server error deleting task.' }, 500);
  }
};

// PATCH /api/tasks/:id/status
export const toggleStatus = async (c) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const { status } = await c.req.json();

    const task = await Task.findOne({ _id: taskId, user: user._id });
    if (!task) {
      return c.json({ message: 'Task not found.' }, 404);
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    // Send email if task was just completed
    if (previousStatus !== 'completed' && status === 'completed') {
      sendTaskCompleted(task, user.email).catch(() => {});
    }

    return c.json({ message: 'Status updated', task });
  } catch (error) {
    console.error('ToggleStatus error:', error);
    return c.json({ message: 'Server error updating status.' }, 500);
  }
};

// PUT /api/tasks/reorder
export const reorderTasks = async (c) => {
  try {
    const user = c.get('user');
    const { tasks } = await c.req.json();

    if (!Array.isArray(tasks)) {
      return c.json({ message: 'Tasks array is required.' }, 400);
    }

    const bulkOps = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id, user: user._id },
        update: { $set: { order: t.order, status: t.status } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    return c.json({ message: 'Tasks reordered' });
  } catch (error) {
    console.error('ReorderTasks error:', error);
    return c.json({ message: 'Server error reordering tasks.' }, 500);
  }
};

// GET /api/tasks/analytics
export const getAnalytics = async (c) => {
  try {
    const user = c.get('user');
    const now = new Date();

    // Total counts
    const [totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
      Task.countDocuments({ user: user._id }),
      Task.countDocuments({ user: user._id, status: 'completed' }),
      Task.countDocuments({ user: user._id, status: 'pending' }),
      Task.countDocuments({ user: user._id, status: 'in-progress' }),
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: user._id,
      status: { $ne: 'completed' },
      dueDate: { $lt: now, $ne: null },
    });

    // Priority distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Weekly completion trend (last 7 days)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTrend = await Task.aggregate([
      {
        $match: {
          user: user._id,
          status: 'completed',
          updatedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const found = weeklyTrend.find((d) => d._id === dateStr);
      trendData.push({ day: dayName, date: dateStr, completed: found ? found.count : 0 });
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return c.json({
      analytics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        completionRate,
        priorityDistribution: priorityDistribution.map((p) => ({
          priority: p._id,
          count: p.count,
        })),
        weeklyTrend: trendData,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return c.json({ message: 'Server error fetching analytics.' }, 500);
  }
};
