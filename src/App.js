// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Register from './pages/Register.js';
import VendorList from './pages/VendorList.js';
import VendorDetails from './pages/VendorDetails';
import BookingForm from './pages/BookingForm';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard.js';
import VendorDashboard from './pages/VendorDashboard.js';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ConnectWithUs from './pages/ConnectWithUs';
import NotFound from './pages/NotFound.js';
import UserProfile from './pages/UserProfile';
import Calendar from './pages/Calendar';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/vendors" element={<VendorList />} />
              <Route path="/vendors/:id" element={<VendorDetails />} />
              <Route
                path="/booking/:id"
                element={
                  <PrivateRoute roles={['customer']}>
                    <BookingForm />
                  </PrivateRoute>
                }
              />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/connect-with-us" element={<ConnectWithUs />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute roles={['customer']}>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/dashboard"
                element={
                  <PrivateRoute roles={['vendor']}>
                    <VendorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute roles={['vendor', 'customer']}>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute roles={['vendor']}>
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
};

export default App;
