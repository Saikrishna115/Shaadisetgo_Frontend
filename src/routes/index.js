import { lazyWithRetry } from '../utils/lazyLoad';

// Define route groups for better code splitting
const routes = [
  {
    path: '/',
    component: lazyWithRetry('pages/Home'),
    exact: true,
  },
  // Auth routes
  {
    path: '/login',
    component: lazyWithRetry('pages/Login'),
    group: 'auth',
  },
  {
    path: '/register',
    component: lazyWithRetry('pages/Register'),
    group: 'auth',
  },
  {
    path: '/forgot-password',
    component: lazyWithRetry('pages/ForgotPassword'),
    group: 'auth',
  },
  {
    path: '/reset-password/:token',
    component: lazyWithRetry('pages/ResetPassword'),
    group: 'auth',
  },
  // Vendor routes
  {
    path: '/vendors',
    component: lazyWithRetry('pages/VendorList'),
    group: 'vendors',
  },
  {
    path: '/vendors/:id',
    component: lazyWithRetry('pages/VendorDetails'),
    group: 'vendors',
  },
  // Protected routes
  {
    path: '/booking/:id',
    component: lazyWithRetry('pages/BookingForm'),
    protected: true,
    roles: ['customer'],
    group: 'bookings',
  },
  // Dashboard routes
  {
    path: '/dashboard',
    component: lazyWithRetry('pages/CustomerDashboard'),
    protected: true,
    roles: ['customer'],
    group: 'dashboard',
  },
  {
    path: '/vendor/dashboard',
    component: lazyWithRetry('pages/VendorDashboard'),
    protected: true,
    roles: ['vendor'],
    group: 'dashboard',
  },
  {
    path: '/admin',
    component: lazyWithRetry('pages/AdminDashboard'),
    protected: true,
    roles: ['admin'],
    group: 'dashboard',
  },
  // Profile routes
  {
    path: '/profile',
    component: lazyWithRetry('pages/UserProfile'),
    protected: true,
    roles: ['vendor', 'customer', 'admin'],
    group: 'profile',
  },
  {
    path: '/vendor/bookings',
    component: lazyWithRetry('pages/VendorBookings'),
    protected: true,
    roles: ['vendor'],
    group: 'bookings',
  },
  {
    path: '/calendar',
    component: lazyWithRetry('pages/Calendar'),
    protected: true,
    roles: ['vendor'],
    group: 'calendar',
  },
  // Static pages
  {
    path: '/contact-us',
    component: lazyWithRetry('pages/ContactUs'),
    group: 'static',
  },
  {
    path: '/privacy-policy',
    component: lazyWithRetry('pages/PrivacyPolicy'),
    group: 'static',
  },
  {
    path: '/terms-of-service',
    component: lazyWithRetry('pages/TermsOfService'),
    group: 'static',
  },
  {
    path: '/connect-with-us',
    component: lazyWithRetry('pages/ConnectWithUs'),
    group: 'static',
  },
  // 404 route
  {
    path: '*',
    component: lazyWithRetry('pages/NotFound'),
  },
];

export default routes; 