import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import api from '../services/api/config';
import './BookingForm.css';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: null,
    selectedPackage: null,
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const steps = ['Details', 'Review', 'Payment'];

  useEffect(() => {
    const fetchVendorDetails = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      eventDate: date
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/bookings', formData);
      navigate('/bookings');
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form-section">
            <Typography variant="h6" className="form-section-title">Tell us about yourself</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </div>
        );

      case 1:
        return (
          <div className="form-section">
            <Typography variant="h6" className="form-section-title">Booking Summary</Typography>
            <Card className="summary-card">
              <CardContent>
                <div className="summary-row">
                  <span className="summary-label">Vendor</span>
                  <span className="summary-value">{vendor?.businessName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Package</span>
                  <span className="summary-value">{formData.selectedPackage?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Event Date</span>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date"
                      value={formData.eventDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Total Amount</span>
                  <span className="total-amount">₹{formData.selectedPackage?.price.toLocaleString('en-IN') || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <Typography variant="h6" className="form-section-title">Payment Details</Typography>
            <div className="payment-section">
              <Typography variant="subtitle1" gutterBottom>Secure your booking with a small deposit</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Expiry Date"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="CVV"
                    name="cardCvv"
                    type="password"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <div className="security-note">
                <LockIcon />
                <Typography variant="body2">
                  Your money is held in escrow until after your event. Payment processed securely via PCI‑Compliant gateway.
                </Typography>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="booking-form-container">
      <Typography variant="h4" align="center" gutterBottom>Confirm Your Booking</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}

        <div className="form-buttons">
          <Button
            className="back-button"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              className="submit-button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Pay & Confirm Booking'}
            </Button>
          ) : (
            <Button
              variant="contained"
              className="next-button"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default BookingForm;