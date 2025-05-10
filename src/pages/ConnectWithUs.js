import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaLinkedin } from 'react-icons/fa';
import './ConnectWithUs.css';

const ConnectWithUs = () => {
  const socialMedia = [
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: 'https://facebook.com/shaadisetgo',
      description: 'Follow us for wedding inspiration, vendor spotlights, and exclusive offers.'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://instagram.com/shaadisetgo',
      description: 'Discover beautiful wedding photos, decor ideas, and real wedding stories.'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: 'https://twitter.com/shaadisetgo',
      description: 'Stay updated with the latest wedding trends and industry news.'
    },
    {
      name: 'Pinterest',
      icon: <FaPinterest />,
      url: 'https://pinterest.com/shaadisetgo',
      description: 'Pin your favorite wedding ideas and create your dream wedding board.'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      url: 'https://youtube.com/shaadisetgo',
      description: 'Watch vendor interviews, wedding tips, and behind-the-scenes content.'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: 'https://linkedin.com/company/shaadisetgo',
      description: 'Connect with us professionally and stay informed about industry developments.'
    }
  ];

  const communityEvents = [
    {
      title: 'Wedding Expo 2023',
      date: 'August 15-16, 2023',
      location: 'Hyderabad International Convention Centre',
      description: 'Meet top wedding vendors, see the latest trends, and get exclusive discounts.'
    },
    {
      title: 'Bridal Masterclass',
      date: 'September 5, 2023',
      location: 'The Leela Palace, Bangalore',
      description: 'Learn makeup tips, styling advice, and pre-wedding skincare routines from experts.'
    },
    {
      title: 'Wedding Planning Workshop',
      date: 'October 10, 2023',
      location: 'Taj Lands End, Mumbai',
      description: 'Get hands-on guidance from professional wedding planners on budgeting, timelines, and more.'
    }
  ];

  return (
    <div className="connect-container">
      <section className="connect-hero">
        <div className="connect-hero-content">
          <h1>Connect With Us</h1>
          <p>Join our community and stay updated with the latest wedding trends and inspiration</p>
        </div>
      </section>

      <section className="social-media-section">
        <h2>Follow Us on Social Media</h2>
        <div className="social-grid">
          {socialMedia.map((platform, index) => (
            <div key={index} className="social-card">
              <a href={platform.url} target="_blank" rel="noopener noreferrer" className="social-link">
                <div className="social-icon">{platform.icon}</div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="community-section">
        <h2>Upcoming Community Events</h2>
        <div className="events-grid">
          {communityEvents.map((event, index) => (
            <div key={index} className="event-card">
              <h3>{event.title}</h3>
              <div className="event-details">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <p className="event-description">{event.description}</p>
              <button className="event-button">Register Interest</button>
            </div>
          ))}
        </div>
      </section>

      <section className="newsletter-connect-section">
        <div className="newsletter-connect-container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get wedding planning tips, vendor recommendations, and exclusive offers delivered to your inbox</p>
          <form className="newsletter-connect-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-connect-input"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="newsletter-connect-button">Subscribe</button>
          </form>
        </div>
      </section>

      <section className="ambassador-section">
        <div className="ambassador-container">
          <h2>Become a ShaadiSetGo Ambassador</h2>
          <p>Are you passionate about weddings? Join our ambassador program and help couples create their dream weddings while earning rewards.</p>
          <button className="ambassador-button">Learn More</button>
        </div>
      </section>
    </div>
  );
};

export default ConnectWithUs;