'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { themes, applyTheme, getInitialTheme, type ThemeName } from '@/lib/themes';

interface ThemeContextProps {
  theme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state consistently to 'default' on both server and client initial render
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsMounted(true);

    // Get the actual theme preference from localStorage
    const initialTheme = getInitialTheme(); // Reads localStorage if available

    // Update the state and apply the theme based on localStorage preference
    setThemeState(initialTheme);
    applyTheme(initialTheme);

  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to apply theme changes whenever the theme state is updated *after* mount
  useEffect(() => {
    // Only apply theme changes after the initial mount effect has determined the theme
    if (isMounted) {
      applyTheme(theme);
      // Saving to localStorage happens inside applyTheme
    }
  }, [theme, isMounted]); // Runs when theme state changes or after mount status changes


  const setTheme = useCallback((themeName: ThemeName) => {
    if (themes[themeName]) {
      setThemeState(themeName);
      // The effect above will handle applying the theme and saving to localStorage via applyTheme
    } else {
      console.warn(`Theme "${themeName}" not found.`);
    }
  }, []);

  const availableThemes = Object.keys(themes) as ThemeName[];

  // Render children immediately. The initial render uses 'default' theme state,
  // matching the server. The useEffect handles client-side theme application
  // after hydration.

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
