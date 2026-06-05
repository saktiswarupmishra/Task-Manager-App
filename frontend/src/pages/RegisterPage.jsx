import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'transparent', text: '' };
    if (password.length < 4) return { width: '25%', color: 'var(--accent-rose)', text: 'Weak' };
    if (password.length < 6) return { width: '50%', color: 'var(--accent-amber)', text: 'Fair' };
    if (password.length < 8) return { width: '75%', color: 'var(--accent-blue)', text: 'Good' };
    return { width: '100%', color: 'var(--accent-emerald)', text: 'Strong' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container" id="register-container">
        <div className="register-illustration">
          <div className="register-illustration-icon">🚀</div>
          <h2>Start Your Journey</h2>
          <p>Join thousands managing tasks efficiently</p>
        </div>

        <div className="register-form-section">
          <h1 className="register-form-title">Create Account</h1>
          <p className="register-form-subtitle">Fill in your details to get started</p>

          {error && <div className="register-error" id="register-error">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              {password && (
                <>
                  <div className="password-strength">
                    <div
                      className="password-strength-bar"
                      style={{ width: strength.width, background: strength.color }}
                    ></div>
                  </div>
                  <p className="password-strength-text" style={{ color: strength.color }}>
                    {strength.text}
                  </p>
                </>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9375rem' }}
              disabled={loading}
              id="register-submit"
            >
              {loading ? <span className="spinner"></span> : 'Create Account'}
            </button>
          </form>

          <div className="register-form-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
