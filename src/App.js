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
import Dashboard from './pages/Dashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import VendorDashboard from './pages/VendorDashboard.js';
import NotFound from './pages/NotFound.js';

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
              <Route path="/vendors" element={<VendorList />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute roles={['customer']}>
                    <Dashboard />
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
