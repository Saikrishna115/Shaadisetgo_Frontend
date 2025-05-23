import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaSearch, FaCalendar } from 'react-icons/fa';
import heroBg from '../assets/hero-bg.jpg';  // Ensure the image path is correct
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Venues', image: '/images/venue.jpg' },
    { name: 'Photography', image: '/images/photography.jpg' },
    { name: 'Catering', image: '/images/catering.jpg' },
    { name: 'Decoration', image: '/images/decoration.jpg' },
    { name: 'Music', image: '/images/music.jpg' },
    { name: 'Makeup', image: '/images/makeup.jpg' }
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: 'Easy Search',
      description: 'Find the perfect wedding vendors in your area with our advanced search filters.'
    },
    {
      icon: <FaHeart />,
      title: 'Trusted Vendors',
      description: 'All our vendors are carefully vetted to ensure the highest quality of service.'
    },
    {
      icon: <FaCalendar />,
      title: 'Simple Booking',
      description: 'Book and manage all your wedding vendors in one place, hassle-free.'
    }
  ];

  const testimonials = [
    {
      content: 'ShaadiSetGo made planning our wedding so much easier. We found amazing vendors all in one place!',
      author: 'Muni & Sai'
    },
    {
      content: 'The platform is user-friendly and the vendors are top-notch. Highly recommended!',
      author: 'Lakshmi & Krishna'
    },
    {
      content: 'Thanks to ShaadiSetGo, we had our dream wedding within our budget.',
      author: 'Meera & Arun'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-content">
          <h1 className="hero-title">Plan Your Perfect Wedding</h1>
          <p className="hero-subtitle">Find and book the best wedding vendors all in one place</p>
          <button className="cta-button" onClick={() => navigate('/vendors')}>Find Your Wedding Vendor</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
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
              <img src={category.image} alt="" className="category-image" />
              <div className="category-overlay">{category.name}</div>
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

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Stay Updated</h2>
        <p>Subscribe to receive wedding planning tips and vendor recommendations</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            aria-label="Email for newsletter"
          />
          <button type="submit" className="cta-button">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default Home;


