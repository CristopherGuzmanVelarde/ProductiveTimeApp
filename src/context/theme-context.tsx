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
  const [theme, setThemeState] = useState<ThemeName>(() => {
    // Get initial theme on the client side only
    if (typeof window !== 'undefined') {
      return getInitialTheme();
    }
    return 'default'; // Server-side default
  });
  const [isClient, setIsClient] = useState(false);

  // Apply theme on initial client load and when theme state changes
  useEffect(() => {
    setIsClient(true); // Mark that we are on the client
    applyTheme(theme);
  }, [theme]);

  // Apply the initial theme once the component mounts on the client
  useEffect(() => {
      const initialTheme = getInitialTheme();
      setThemeState(initialTheme);
      applyTheme(initialTheme); // Ensure styles are applied immediately
  }, []);


  const setTheme = useCallback((themeName: ThemeName) => {
    if (themes[themeName]) {
      setThemeState(themeName);
      // applyTheme is called by the effect above
    } else {
      console.warn(`Theme "${themeName}" not found.`);
    }
  }, []);

  const availableThemes = Object.keys(themes) as ThemeName[];

  // Prevent rendering children until the client-side theme is determined
   if (!isClient && typeof window === 'undefined') {
     // Optional: Render a loading state or null during SSR/build time
     // This helps avoid hydration mismatches if initial theme differs
     return null;
   }


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
