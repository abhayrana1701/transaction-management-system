import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({});

export default theme;

// Define light theme settings
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Light primary blue color
    },
    secondary: {
      main: '#42a5f5', // Light secondary blue color
    },
    background: {
      default: '#ffffff', // Light background color
      paper: '#fafafa',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Define dark theme settings
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6', // Dark primary blue color
    },
    secondary: {
      main: '#1e88e5', // Dark secondary blue color
    },
    background: {
      default: '#121212', // Dark background color
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
