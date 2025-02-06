import React, { createContext, useState, useEffect, useCallback, useMemo, FC } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';

type ThemeContextType = {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load the saved theme mode from localStorage or default to 'light'
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Sync state with localStorage on mount
  useEffect(() => {
    const savedMode = (localStorage.getItem('darkmode') as 'light' | 'dark') || 'light';
    setMode(savedMode);
  }, []);

  // Memoize theme based on the current mode
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('darkmode', newMode); // Store the new mode in localStorage
      return newMode;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
