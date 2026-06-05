import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const FEATURES = [
  { icon: '✅', title: 'Smart Task Management', desc: 'Create, update, and organize tasks with priorities, due dates, and statuses.', bg: 'var(--accent-blue-light)' },
  { icon: '🔄', title: 'Drag & Drop Board', desc: 'Kanban-style board to visually manage tasks across Pending, In Progress, and Done.', bg: 'var(--accent-purple-light)' },
  { icon: '📊', title: 'Dashboard Analytics', desc: 'Track your productivity with charts showing completion rates and trends.', bg: 'var(--accent-emerald-light)' },
  { icon: '✨', title: 'AI Recommendations', desc: 'Get smart suggestions to prioritize tasks and boost productivity.', bg: 'var(--accent-amber-light)' },
  { icon: '🔔', title: 'Due Date Reminders', desc: 'Never miss a deadline with automatic email notifications.', bg: 'var(--accent-rose-light)' },
  { icon: '🔒', title: 'Secure Authentication', desc: 'JWT-based auth with encrypted passwords keeps your data safe.', bg: 'rgba(6,182,212,0.15)' },
];

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">⚡ Powered by AI</div>
          <h1>Manage Tasks<br /><span className="hero-gradient-text">Smarter & Faster</span></h1>
          <p>TaskFlow helps you organize, prioritize, and track your work with an intelligent dashboard, drag-and-drop board, and AI-powered insights.</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/tasks" className="btn-primary" id="hero-cta" style={{ textDecoration: 'none' }}>Go to My Tasks →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" id="hero-cta" style={{ textDecoration: 'none' }}>Get Started — It's Free</Link>
                <Link to="/login" className="btn-secondary" id="hero-login" style={{ textDecoration: 'none' }}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="features">
        <div className="features-header">
          <h2>Everything You Need</h2>
          <p>A complete toolkit for modern task management</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta">
        <div className="cta-box">
          <h2>Ready to Get Productive?</h2>
          <p>Join TaskFlow today and start managing your tasks like a pro.</p>
          <Link to={user ? '/tasks' : '/register'} className="btn-primary" style={{ textDecoration: 'none' }} id="cta-btn">
            {user ? 'Open Dashboard' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
