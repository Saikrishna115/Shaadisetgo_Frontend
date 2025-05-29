import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import theme from './theme';
import './styles/globals.css';
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
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