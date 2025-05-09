import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';

import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/customer/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/customer/dashboard"
            element={
              <PrivateRoute role="customer">
                <CustomerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/vendor/dashboard"
            element={
              <PrivateRoute role="vendor">
                <VendorDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
