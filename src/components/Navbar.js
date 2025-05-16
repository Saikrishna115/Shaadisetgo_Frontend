import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout(navigate);
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">ShaadiSetGo</Link>
      </div>
      <div className="nav-links">
        <Link to="/vendors" className="nav-link">Vendors</Link>
        {isAuthenticated && user ? (
          <>
            <Link 
              to={user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard'} 
              className="nav-link"
            >
              Dashboard
            </Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
