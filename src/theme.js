import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D27D77', // Rose gold from logo
      light: '#E8A39E',
      dark: '#B85E58',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFB74D', // Gold from logo
      light: '#FFCC80',
      dark: '#FFA726',
      contrastText: '#000',
    },
    background: {
      default: '#FFF5F5', // Light pink background
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme; 