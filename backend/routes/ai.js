import { Hono } from 'hono';
import authMiddleware from '../middleware/auth.js';
import { getRecommendations } from '../controllers/aiController.js';

const ai = new Hono();

ai.use('/*', authMiddleware);
ai.post('/recommendations', getRecommendations);

export default ai;
