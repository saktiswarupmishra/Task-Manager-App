import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
export const register = async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ message: 'Please provide name, email, and password.' }, 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ message: 'An account with this email already exists.' }, 400);
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    return c.json(
      {
        message: 'Registration successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      201
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return c.json({ message: messages.join(', ') }, 400);
    }
    console.error('Register error:', error);
    return c.json({ message: 'Server error during registration.' }, 500);
  }
};

// POST /api/auth/login
export const login = async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: 'Please provide email and password.' }, 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ message: 'Invalid email or password.' }, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return c.json({ message: 'Invalid email or password.' }, 401);
    }

    const token = generateToken(user._id);

    return c.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ message: 'Server error during login.' }, 500);
  }
};

// GET /api/auth/me
export const getMe = async (c) => {
  try {
    const user = c.get('user');
    return c.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return c.json({ message: 'Server error.' }, 500);
  }
};
