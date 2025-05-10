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
          <Link to="/vendors" aria-label="Find Vendors">Find Vendors</Link>
          <Link to="/register" aria-label="Become a Vendor">Become a Vendor</Link>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <Link to="/contact-us" aria-label="Contact Us">Contact Us</Link>
          <Link to="/connect-with-us" aria-label="Connect With Us">Connect With Us</Link>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <Link to="/privacy-policy" aria-label="Privacy Policy">Privacy Policy</Link>
          <Link to="/terms-of-service" aria-label="Terms of Service">Terms of Service</Link>
        </div>

        <div className="footer-section">
          <h4>Social Media</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
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
