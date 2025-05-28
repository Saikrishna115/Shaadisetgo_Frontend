import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './VendorList.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    availability: ''
  });

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors', { params: filters });
      setVendors(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendors. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const location = "Mumbai"; // This would come from URL params or state
  const resultsCount = vendors.length;

  return (
    <div className="vendor-list-container">
      <h1>Find the Perfect Wedding Vendor</h1>
      
      <div className="results-header">
        Showing {resultsCount} vendors in {location}
      </div>

      <div className="filters-panel">
        <div className="filter-section">
          <h3>Category</h3>
          <select 
            name="category" 
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="photographer">Photographer</option>
            <option value="caterer">Caterer</option>
            <option value="decorator">Decorator</option>
            <option value="venue">Venue</option>
            <option value="makeup">Makeup Artist</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Price Range</h3>
          <select 
            name="priceRange" 
            value={filters.priceRange}
            onChange={handleFilterChange}
          >
            <option value="">All Prices</option>
            <option value="0-50000">Under ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
            <option value="200000+">Above ₹2,00,000</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Rating & Reviews</h3>
          <select 
            name="rating" 
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="">All Ratings</option>
            <option value="4">4+ ⭐️</option>
            <option value="3">3+ ⭐️</option>
            <option value="2">2+ ⭐️</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Availability</h3>
          <select 
            name="availability" 
            value={filters.availability}
            onChange={handleFilterChange}
          >
            <option value="">Any Time</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
            <option value="3-months">Next 3 Months</option>
          </select>
        </div>
      </div>

      <div className="vendors-grid">
        {vendors.length > 0 ? (
          vendors.map(vendor => (
            <div key={vendor._id} className="vendor-card">
              <div className="vendor-image">
                <img src={vendor.profileImage || '/default-vendor.png'} alt={vendor.businessName} />
              </div>
              <div className="vendor-info">
                <div className="vendor-header">
                  <h3>{vendor.businessName}</h3>
                  <span className="verified-badge">✔️ Verified</span>
                </div>
                <div className="vendor-rating">
                  ⭐️ {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                </div>
                <div className="vendor-price">
                  Starting at ₹{vendor.startingPrice.toLocaleString('en-IN')}
                </div>
                <button className="quote-btn">Get Quote</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-vendors">
            <h3>Oops! No vendors found for that search.</h3>
            <p>Try widening your search radius or selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;