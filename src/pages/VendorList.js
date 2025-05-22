import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/config';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  Skeleton
} from '@mui/material';
import './VendorList.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/vendors');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setVendors(response.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch vendors. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.serviceType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderSkeletonCards = () => (
    <div className="vendors-grid">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="vendor-card">
          <Skeleton variant="rectangular" height={200} />
          <div className="vendor-info">
            <Skeleton variant="text" height={32} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Skeleton variant="text" height={60} />
            <div className="vendor-footer">
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="rectangular" width={100} height={36} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="vendor-list-container">
        <div className="vendor-list-header">
          <h1>Find Your Perfect Vendor</h1>
          <div className="search-filters">
            <Skeleton variant="rectangular" height={48} className="search-input" />
            <Skeleton variant="rectangular" height={48} className="category-select" />
          </div>
        </div>
        {renderSkeletonCards()}
      </div>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchVendors}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <div className="vendor-list-container">
      <div className="vendor-list-header">
        <h1>Find Your Perfect Vendor</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search vendors by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            <option value="Venue">Venue</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Decoration">Decoration</option>
            <option value="Music">Music</option>
            <option value="Mehendi">Mehendi</option>
            <option value="Makeup">Makeup</option>
          </select>
        </div>
      </div>

      <div className="vendors-grid">
        {filteredVendors.map(vendor => (
          <div key={vendor._id} className="vendor-card">
            <div className="vendor-image">
              {vendor.images && vendor.images.length > 0 ? (
                <img src={vendor.images[0]} alt={vendor.businessName} />
              ) : (
                <img src="/images/vendor-placeholder.jpg" alt="Vendor" />
              )}
            </div>
            <div className="vendor-info">
              <h3>{vendor.businessName}</h3>
              <div className="vendor-category">{vendor.serviceType}</div>
              <p className="vendor-description">{vendor.description}</p>
              <div className="vendor-footer">
                <span className="vendor-price">
                  {vendor.priceRange && typeof vendor.priceRange === 'object' 
                    ? `₹${vendor.priceRange.min || 0} - ₹${vendor.priceRange.max || 0}`
                    : vendor.priceRange || 'Price not specified'}
                </span>
                <button 
                  className="book-btn"
                  onClick={() => navigate(`/vendors/${vendor._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="no-results">
            <p>No vendors found matching your criteria</p>
            <button 
              className="book-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;
