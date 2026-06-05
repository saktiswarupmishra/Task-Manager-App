import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">T</div>
        <span className="navbar-title">TaskFlow</span>
      </Link>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        id="nav-toggle"
      >
        {menuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>

      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="navbar-nav">
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              id="nav-home"
            >
              Home
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/tasks"
                className={`navbar-link ${isActive('/tasks') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                id="nav-tasks"
              >
                My Tasks
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="navbar-avatar">{getInitials(user.name)}</div>
              <span className="navbar-username">{user.name}</span>
              <button className="navbar-logout" onClick={logout} id="nav-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-link"
                onClick={() => setMenuOpen(false)}
                id="nav-login"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                onClick={() => setMenuOpen(false)}
                id="nav-register"
                style={{ textDecoration: 'none', fontSize: '0.8125rem', padding: '8px 20px' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
