import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ message: 'Access denied. No token provided.' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return c.json({ message: 'User not found.' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid or expired token.' }, 401);
  }
};

export default authMiddleware;
