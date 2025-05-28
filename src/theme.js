import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC1CC', // Blush Pink
      light: '#FFD4DB',
      dark: '#E5A9B3',
      contrastText: '#000',
    },
    secondary: {
      main: '#D4AF37', // Gold
      light: '#E0C35C',
      dark: '#B39126',
      contrastText: '#000',
    },
    background: {
      default: '#FFF8F0', // Ivory
      paper: '#FFFFFF',
    },
    teal: {
      main: '#B2DFDB', // Soft Teal
      light: '#C4E7E3',
      dark: '#95C9C4',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '3.75rem',
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '3rem',
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  spacing: (factor) => `${8 * factor}px`,
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
          padding: '32px', // p-8
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '48px', // mt-12
          paddingBottom: '48px',
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