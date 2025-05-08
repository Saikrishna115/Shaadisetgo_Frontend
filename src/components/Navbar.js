import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">ShaadiSetGo</Link>
      </div>
      <div className="nav-links">
        <Link to="/vendors" className="nav-link">Vendors</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
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
