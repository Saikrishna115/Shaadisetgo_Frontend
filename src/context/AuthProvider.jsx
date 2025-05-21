import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, refreshToken } from '../store/slices/authSlice';

const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on mount
    dispatch(getCurrentUser());

    // Set up token refresh interval if authenticated
    let refreshInterval;
    if (isAuthenticated) {
      refreshInterval = setInterval(() => {
        dispatch(refreshToken());
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}; 