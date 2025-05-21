// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/common/Notification';
import LoadingOverlay from './components/common/LoadingOverlay';
import routes from './routes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Always loaded components
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Loading fallback component
const PageLoadingFallback = () => (
  <LoadingOverlay open={true} message="Loading page..." />
);

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              <Notification />
              <Navbar />
              <main className="main-content">
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {routes.map((route) => {
                      const Component = route.component;
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            route.protected ? (
                              <PrivateRoute roles={route.roles}>
                                <Component />
                              </PrivateRoute>
                            ) : (
                              <Component />
                            )
                          }
                        />
                      );
                    })}
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
