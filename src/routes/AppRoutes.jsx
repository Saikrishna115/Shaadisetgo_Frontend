import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../pages/Home.js';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import VendorList from '../pages/Services/VendorList';
import AdminDashboard from '../pages/AdminDashboard.js';
import NotFound from '../pages/NotFound.js';
import Blog from '../pages/Blog';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;