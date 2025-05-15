import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = React.memo() => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-content">
        <section className="footer-section" aria-labelledby="about-heading">
          <h3 id="about-heading">ShaadiSetGo</h3>
          <p>Making wedding planning easier for everyone.</p>
        </section>
        
        <nav className="footer-section" aria-labelledby="quicklinks-heading">
          <h4 id="quicklinks-heading">Quick Links</h4>
          <ul>
            <li><Link to="/vendors">Find Vendors</Link></li>
            <li><Link to="/register">Become a Vendor</Link></li>
          </ul>
        </nav>

        <nav className="footer-section" aria-labelledby="support-heading">
          <h4 id="support-heading">Support</h4>
          <ul>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/connect-with-us">Connect With Us</Link></li>
          </ul>
        </nav>

        <nav className="footer-section" aria-labelledby="legal-heading">
          <h4 id="legal-heading">Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </nav>

        <section className="footer-section" aria-labelledby="social-heading">
          <h4 id="social-heading">Social Media</h4>
          <ul className="social-links" aria-label="Social media links">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page (opens in new window)">
                <i className="fab fa-facebook" aria-hidden="true"></i>
                <span className="sr-only">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page (opens in new window)">
                <i className="fab fa-instagram" aria-hidden="true"></i>
                <span className="sr-only">Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page (opens in new window)">
                <i className="fab fa-twitter" aria-hidden="true"></i>
                <span className="sr-only">Twitter</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
      
      <div className="footer-bottom" role="contentinfo">
        <p>&copy; {new Date().getFullYear()} ShaadiSetGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
