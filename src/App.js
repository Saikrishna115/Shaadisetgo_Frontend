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
import { Box } from '@mui/material';

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
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Notification />
                <Navbar />
                <Box
                  component="main"
                  className="main-content"
                  sx={{
                    flexGrow: 1,
                    width: '100%',
                    minHeight: '100vh',
                    pt: { xs: '56px', sm: '64px' }, // Add padding top to account for navbar height
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
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
                </Box>
                <Footer />
              </Box>
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
