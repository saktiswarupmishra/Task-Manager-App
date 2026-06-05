import { Hono } from 'hono';
import { register, login, getMe } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const auth = new Hono();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/me', authMiddleware, getMe);

export default auth;
