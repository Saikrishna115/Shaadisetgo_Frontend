import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import theme from './theme';
import './styles/globals.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;