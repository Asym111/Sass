import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7c3aed' }, // современный фиолетовый
    secondary: { main: '#f43f5e' }, // модный розовый
    background: { default: '#f3f4f6', paper: '#fff' },
    text: { primary: '#18181b', secondary: '#71717a' }
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.8rem' },
    h2: { fontWeight: 700, fontSize: '2rem' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem'
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c3aed' },
    secondary: { main: '#f43f5e' },
    background: { default: '#18181b', paper: '#23232b' },
    text: { primary: '#f3f4f6', secondary: '#a1a1aa' }
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.8rem' },
    h2: { fontWeight: 700, fontSize: '2rem' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem'
        }
      }
    }
  }
});
