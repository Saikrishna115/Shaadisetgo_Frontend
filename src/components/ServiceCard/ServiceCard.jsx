import React from 'react';
import PropTypes from 'prop-types';
import './ServiceCard.css';

const ServiceCard = ({ name, type, image, rating, price }) => {
  return (
    <div className="service-card">
      <div className="service-card-image">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="service-card-content">
        <h3 className="service-card-name">{name}</h3>
        <p className="service-card-type">{type}</p>
        <div className="service-card-footer">
          <div className="service-card-rating">
            <span className="star">★</span>
            <span>{rating}</span>
          </div>
          <div className="service-card-price">
            <span>₹{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};

export default ServiceCard;