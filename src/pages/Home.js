import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaCamera, FaUtensils, FaPaintBrush, FaMusic, FaPalette, FaClock, FaMoneyBillWave, FaUserCheck, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import heroBg from '../assets/wedding-bg.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Venues', icon: <FaBuilding className="text-5xl text-pink-500" /> },
    { name: 'Photography', icon: <FaCamera className="text-5xl text-pink-500" /> },
    { name: 'Catering', icon: <FaUtensils className="text-5xl text-pink-500" /> },
    { name: 'Decoration', icon: <FaPaintBrush className="text-5xl text-pink-500" /> },
    { name: 'Music', icon: <FaMusic className="text-5xl text-pink-500" /> },
    { name: 'Makeup', icon: <FaPalette className="text-5xl text-pink-500" /> }
  ];

  const howItWorks = [
    {
      icon: <FaSearch />,
      title: 'Discover',
      description: 'Search top-rated photographers, caterers & decorators in your city.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Compare',
      description: 'Get instant, transparent quotes—no hidden fees.'
    },
    {
      icon: <FaLock />,
      title: 'Book',
      description: 'Secure your vendor with built-in escrow and relax.'
    }
  ];

  const features = [
    {
      icon: <FaClock />,
      title: 'Save Time & Effort',
      description: 'Browse 300+ vetted vendors in one place—stop toggling between sites.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Transparent Pricing',
      description: 'View real quotes upfront. No surprises, ever.'
    },
    {
      icon: <FaUserCheck />,
      title: 'Trusted Pros',
      description: 'Every vendor is background-checked and rated by real couples.'
    },
    {
      icon: <FaLock />,
      title: 'Hassle-Free Payments',
      description: 'Secure, escrow-backed transactions protect your deposit until your big day.'
    }
  ];

  const featureHighlights = [
    {
      title: 'Geo-Detect & Prefill',
      description: 'Start planning instantly—location detected for you.'
    },
    {
      title: 'Smart Search',
      description: 'Type once; get service + city suggestions in real time.'
    },
    {
      title: 'Live Chat & Support',
      description: 'Got questions? Chat with our wedding experts anytime.'
    }
  ];

  const testimonials = [
    {
      content: 'ShaadiSetGo made finding my photographer a breeze. I compared 5 quotes and booked within 24 hours!',
      author: 'Priya & Rohit, Delhi'
    },
    {
      content: 'I saved hours and Rs.10,000 by comparing caterers side by side. Highly recommend!',
      author: 'Ananya & Karan, Bangalore'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Plan Your Dream Wedding in Minutes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Connect instantly with handpicked, verified local vendors—no endless searches, no surprises.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="search-bar-container"
          >
            <input
              type="text"
              placeholder="e.g. Photographer • Mumbai"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button" onClick={() => navigate('/vendors')}>
              Find Vendors
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="social-proof"
          >
            <p>⭐️⭐️⭐️⭐️⭐️ 4.9/5 average vendor rating • Trusted by 12,000+ couples nationwide</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="steps-grid">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Core Benefits
        </motion.h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={index}
              className="category-card"
              onClick={() => navigate('/vendors')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/vendors');
                }
              }}
              aria-label={`Browse ${category.name} vendors`}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Couples Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-content">"{testimonial.content}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="feature-highlights-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Feature Highlights
        </motion.h2>
        <div className="highlights-grid">
          {featureHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="highlight-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="trust-section">
        <motion.div
          className="trust-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="trust-badges">
            <span>✔️ PCI-Compliant Payments</span>
            <span>✔️ SSL Secured</span>
            <span>✔️ 24/7 Customer Support</span>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Planning?</h2>
          <p>Get free, no-obligation quotes from top wedding pros today.</p>
          <button className="cta-button" onClick={() => navigate('/vendors')}>Get My Quotes →</button>
        </motion.div>
      </section>

      {/* Footer Links */}
      <footer className="footer-section">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/help">Help Center</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;


