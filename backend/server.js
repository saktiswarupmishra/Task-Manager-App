import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import cron from 'node-cron';

import connectDB from './config/db.js';
import { initTransporter, sendDueReminder } from './utils/email.js';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import aiRoutes from './routes/ai.js';

import Task from './models/Task.js';
import User from './models/User.js';

const app = new Hono();

// Middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use('/*', logger());

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/tasks', taskRoutes);
app.route('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.json({ message: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ message: 'Internal server error' }, 500);
});

// Due date reminder cron job — runs every hour
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dueSoonTasks = await Task.find({
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: in24Hours },
      reminderSent: false,
    }).populate('user', 'email');

    for (const task of dueSoonTasks) {
      if (task.user?.email) {
        await sendDueReminder(task, task.user.email);
        task.reminderSent = true;
        await task.save();
      }
    }

    if (dueSoonTasks.length > 0) {
      console.log(`⏰ Sent ${dueSoonTasks.length} due date reminder(s)`);
    }
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initTransporter();

  serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    (info) => {
      console.log(`\n🚀 Task Manager API running on http://localhost:${info.port}`);
      console.log(`📋 Health check: http://localhost:${info.port}/api/health\n`);
    }
  );
};

startServer();
