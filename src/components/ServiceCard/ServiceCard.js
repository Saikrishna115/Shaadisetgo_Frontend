import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ name, type, image, rating, price }) => {
  return (
    <div className="service-card">
      <div className="service-card-image">
        <img src={image} alt={name} />
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

export default ServiceCard;