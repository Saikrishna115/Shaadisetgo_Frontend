import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Paper,
  ImageList,
  ImageListItem
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import api from '../services/api/config';
import './VendorDetails.css';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVendorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/vendors/${id}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setVendor(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      setError(err.response?.data?.message || 'Failed to fetch vendor details');
      setVendor(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id, fetchVendorDetails]);

  const handleGetQuote = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vendors/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vendor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error || 'Vendor not found'}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/vendors')}
          >
            Back to Vendors
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/vendors')}
          sx={{ mb: 3 }}
        >
          Back to Vendors
        </Button>

        <div className="vendor-profile">
          {/* Vendor Header */}
          <div className="vendor-header">
            <h1 className="vendor-name">
              {vendor.businessName}
              <span className="verified-badge">✔️ Verified</span>
            </h1>
            <div className="vendor-rating">
              ⭐️ {vendor.rating?.toFixed(1)} ({vendor.reviewCount} reviews)
            </div>
            <div className="vendor-location">
              <LocationIcon />
              {vendor.city}, {vendor.state}
            </div>
          </div>

          {/* About Section */}
          <div className="about-section">
            <h2>About</h2>
            <p className="vendor-tagline">{vendor.tagline}</p>
            <p className="vendor-description">{vendor.description}</p>
          </div>

          {/* Pricing & Packages */}
          <div className="packages-section">
            <h2>Pricing & Packages</h2>
            <div className="package-grid">
              {vendor.packages?.map((pkg, index) => (
                <div key={index} className="package-card">
                  <h3>{pkg.name}</h3>
                  <div className="package-price">₹{pkg.price.toLocaleString('en-IN')}</div>
                  <ul className="package-features">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <button className="select-package-btn" onClick={handleGetQuote}>
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="gallery-section">
            <h2>Gallery of Past Weddings</h2>
            <ImageList variant="masonry" cols={3} gap={8}>
              {vendor.gallery?.map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    src={item.url}
                    alt={item.description}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>What Couples Are Saying</h2>
            <div className="reviews-grid">
              {vendor.reviews?.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-rating">⭐️ {review.rating}</div>
                  <p className="review-text">{review.comment}</p>
                  <div className="reviewer-name">- {review.userName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Sticky CTA Bar */}
      <div className="sticky-cta-bar">
        <div className="cta-content">
          <span>Ready to book {vendor.businessName}?</span>
          <button className="cta-button" onClick={handleGetQuote}>
            Get My Instant Quote
          </button>
        </div>
      </div>
    </>
  );
};

export default VendorDetails;