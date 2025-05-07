import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ShaadiSetGo</h3>
          <p>Making wedding planning easier for everyone.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/vendors">Find Vendors</Link>
          <Link to="/register">Become a Vendor</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShaadiSetGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;