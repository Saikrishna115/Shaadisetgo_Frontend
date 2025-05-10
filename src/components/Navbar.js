import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  const [showFooterLinks, setShowFooterLinks] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleFooterLinks = () => {
    setShowFooterLinks(!showFooterLinks);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">ShaadiSetGo</Link>
      </div>
      <div className="nav-links">
        <Link to="/vendors" className="nav-link">Vendors</Link>
        <div className="nav-dropdown">
          <button className="nav-link dropdown-btn" onClick={toggleFooterLinks}>More</button>
          {showFooterLinks && (
            <div className="dropdown-content">
              <Link to="/contact-us" className="dropdown-link">Contact Us</Link>
              <Link to="/connect-with-us" className="dropdown-link">Connect With Us</Link>
              <Link to="/privacy-policy" className="dropdown-link">Privacy Policy</Link>
              <Link to="/terms-of-service" className="dropdown-link">Terms of Service</Link>
            </div>
          )}
        </div>
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
