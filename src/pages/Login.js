import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Updated the URL to use the backend deployed on Render
      const response = await axios.post('https://shaadisetgo-backend.onrender.com/api/auth/login', formData);
      
      // Store the token and navigate to the dashboard
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section"></div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
