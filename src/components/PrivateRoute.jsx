import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Container } from '@mui/material';
import { getCurrentUser } from '../store/slices/authSlice';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !loading && localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    switch (user.role) {
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'customer':
        return <Navigate to="/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;