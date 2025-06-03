import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    setSubmitted(true);
    setError('');
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out with any questions about our services.</p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <h3>Email Us</h3>
            <p>info@shaadisetgo.com</p>
            <p>support@shaadisetgo.com</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <FaPhone />
            </div>
            <h3>Call Us</h3>
            <p>+91 70133 40472</p>
            <p>+91 90001 11373</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Visit Us</h3>
            <p>tirupati</p>
            <p>Tirupati City, Andhra Pradesh, India 517501</p>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </section>

      <section className="map-section">
        <div className="map-container">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            {/* In a real implementation, you would embed a Google Map here */}
            <div className="map-image">Map will be displayed here</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;