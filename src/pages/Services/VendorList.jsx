import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './VendorList.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    rating: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors', { params: filters });
      setVendors(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendors. Please try again later.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchVendors();
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="vendor-list-container">
      <h1>Wedding Vendors</h1>
      
      <div className="filters-section">
        <select 
          name="category" 
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="photographer">Photographer</option>
          <option value="caterer">Caterer</option>
          <option value="venue">Venue</option>
          <option value="decorator">Decorator</option>
          <option value="makeup">Makeup Artist</option>
        </select>

        <select 
          name="location" 
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">All Locations</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
          <option value="bangalore">Bangalore</option>
          <option value="chennai">Chennai</option>
        </select>

        <select 
          name="priceRange" 
          value={filters.priceRange}
          onChange={handleFilterChange}
        >
          <option value="">All Price Ranges</option>
          <option value="budget">Budget</option>
          <option value="moderate">Moderate</option>
          <option value="premium">Premium</option>
          <option value="luxury">Luxury</option>
        </select>

        <select 
          name="rating" 
          value={filters.rating}
          onChange={handleFilterChange}
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>

        <button onClick={applyFilters} className="apply-filters-btn">
          Apply Filters
        </button>
      </div>

      <div className="vendors-grid">
        {vendors.length > 0 ? (
          vendors.map(vendor => (
            <div key={vendor._id} className="vendor-card">
              <div className="vendor-image">
                <img src={vendor.profileImage || '/default-vendor.png'} alt={vendor.businessName} />
              </div>
              <div className="vendor-info">
                <h3>{vendor.businessName}</h3>
                <p className="vendor-category">{vendor.category}</p>
                <p className="vendor-location">{vendor.city}</p>
                <div className="vendor-rating">
                  <span className="stars">{'★'.repeat(vendor.rating)}</span>
                  <span className="rating-count">({vendor.reviewCount} reviews)</span>
                </div>
                <p className="price-range">{vendor.priceRange}</p>
                <Link to={`/vendors/${vendor._id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-vendors">
            <p>No vendors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList; 