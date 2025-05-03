// src/lib/themes.ts

// Base variables structure (ensure all used variables are included)
const baseVariables = {
  '--radius': '0.5rem',
  // Chart colors can be kept consistent or varied per theme
  '--chart-1': '12 76% 61%',
  '--chart-2': '173 58% 39%',
  '--chart-3': '197 37% 24%',
  '--chart-4': '43 74% 66%',
  '--chart-5': '27 87% 67%',
};

// Theme definitions
export const themes = {
  // Original Light Theme (renamed 'default')
  default: {
    ...baseVariables,
    '--background': '0 0% 100%', /* White */
    '--foreground': '222.2 84% 4.9%', /* Very Dark Blue */
    '--card': '0 0% 100%',
    '--card-foreground': '222.2 84% 4.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '222.2 84% 4.9%',
    '--primary': '221.2 83.2% 53.3%', /* Blue */
    '--primary-foreground': '210 40% 98%', /* Near White */
    '--secondary': '210 40% 96.1%', /* Very Light Blue-Gray */
    '--secondary-foreground': '222.2 47.4% 11.2%', /* Dark Blue */
    '--muted': '210 40% 96.1%',
    '--muted-foreground': '215 20.2% 65.1%', /* Grayish Blue */
    '--accent': '16 100% 66%', /* Orange (#FF7F50) */
    '--accent-foreground': '20 14.3% 4.1%', /* Very Dark Brown/Black */
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '214.3 31.8% 91.4%', /* Light Gray */
    '--input': '214.3 31.8% 91.4%',
    '--ring': '221.2 83.2% 53.3%', /* Blue */
    // Sidebar variables for default theme
    '--sidebar-background': '0 0% 98%',
    '--sidebar-foreground': '240 5.3% 26.1%',
    '--sidebar-primary': '221.2 83.2% 53.3%',
    '--sidebar-primary-foreground': '0 0% 98%',
    '--sidebar-accent': '210 40% 96.1%',
    '--sidebar-accent-foreground': '222.2 47.4% 11.2%',
    '--sidebar-border': '214.3 31.8% 91.4%',
    '--sidebar-ring': '221.2 83.2% 53.3%',
  },
  // Original Dark Theme (renamed 'dark_blue')
  dark_blue: {
    ...baseVariables,
     // Chart colors specifically for dark theme
     '--chart-1': '220 70% 50%',
     '--chart-2': '160 60% 45%',
     '--chart-3': '30 80% 55%',
     '--chart-4': '280 65% 60%',
     '--chart-5': '340 75% 55%',
    '--background': '222.2 84% 4.9%', /* Very Dark Blue */
    '--foreground': '210 40% 98%', /* Near White */
    '--card': '222.2 84% 4.9%',
    '--card-foreground': '210 40% 98%',
    '--popover': '222.2 84% 4.9%',
    '--popover-foreground': '210 40% 98%',
    '--primary': '217.2 91.2% 59.8%', /* Brighter Blue for Dark */
    '--primary-foreground': '222.2 47.4% 11.2%', /* Dark Blue */
    '--secondary': '217.2 32.6% 17.5%', /* Darker Blue-Gray */
    '--secondary-foreground': '210 40% 98%',
    '--muted': '217.2 32.6% 17.5%',
    '--muted-foreground': '215 20.2% 65.1%', /* Grayish Blue */
    '--accent': '16 80% 56%', /* Slightly desaturated Orange for Dark */
    '--accent-foreground': '210 40% 98%',
    '--destructive': '0 62.8% 30.6%', /* Dark Red */
    '--destructive-foreground': '0 0% 98%',
    '--border': '217.2 32.6% 17.5%',
    '--input': '217.2 32.6% 17.5%',
    '--ring': '217.2 91.2% 59.8%', /* Brighter Blue */
     /* Dark Sidebar */
    '--sidebar-background': '222.2 84% 4.9%',
    '--sidebar-foreground': '210 40% 98%',
    '--sidebar-primary': '217.2 91.2% 59.8%',
    '--sidebar-primary-foreground': '222.2 47.4% 11.2%',
    '--sidebar-accent': '217.2 32.6% 17.5%',
    '--sidebar-accent-foreground': '210 40% 98%',
    '--sidebar-border': '217.2 32.6% 17.5%',
    '--sidebar-ring': '217.2 91.2% 59.8%',
  },
  forest: {
    ...baseVariables,
    '--background': '120 10% 95%', // Very light green-gray
    '--foreground': '120 30% 10%', // Dark green
    '--card': '110 15% 98%', // Off-white with green tint
    '--card-foreground': '120 30% 10%',
    '--popover': '110 15% 98%',
    '--popover-foreground': '120 30% 10%',
    '--primary': '130 45% 40%', // Forest green
    '--primary-foreground': '110 40% 98%', // Very light green
    '--secondary': '110 20% 90%', // Light green-gray
    '--secondary-foreground': '130 40% 30%', // Darker green
    '--muted': '110 20% 90%',
    '--muted-foreground': '120 10% 55%', // Grayish green
    '--accent': '40 60% 55%', // Earthy gold/yellow
    '--accent-foreground': '40 90% 5%', // Very dark brown
    '--destructive': '0 60% 50%', // Muted red
    '--destructive-foreground': '0 0% 98%',
    '--border': '110 15% 85%', // Light green-gray border
    '--input': '110 15% 85%',
    '--ring': '130 45% 40%', // Forest green
    // Sidebar variables for forest theme
    '--sidebar-background': '120 15% 92%', // Slightly darker light green-gray
    '--sidebar-foreground': '120 30% 15%', // Dark green (slightly lighter than main fg)
    '--sidebar-primary': '130 45% 40%', // Forest green
    '--sidebar-primary-foreground': '110 40% 98%', // Very light green
    '--sidebar-accent': '110 20% 88%', // Darker light green-gray for accent
    '--sidebar-accent-foreground': '130 40% 30%', // Darker green
    '--sidebar-border': '110 15% 80%', // Slightly darker border
    '--sidebar-ring': '130 45% 40%', // Forest green
  },
  sunset: {
    ...baseVariables,
    '--background': '30 80% 96%', // Very light peach
    '--foreground': '20 50% 20%', // Dark warm brown
    '--card': '25 70% 98%', // Lighter peach/off-white
    '--card-foreground': '20 50% 20%',
    '--popover': '25 70% 98%',
    '--popover-foreground': '20 50% 20%',
    '--primary': '15 80% 55%', // Burnt orange
    '--primary-foreground': '30 80% 98%', // Very light peach/white
    '--secondary': '35 60% 92%', // Light orange-tan
    '--secondary-foreground': '15 70% 30%', // Darker burnt orange
    '--muted': '35 60% 92%',
    '--muted-foreground': '30 20% 60%', // Muted grayish-orange
    '--accent': '340 70% 60%', // Warm pink/magenta
    '--accent-foreground': '340 90% 10%', // Very dark magenta/brown
    '--destructive': '0 70% 55%', // Warm red
    '--destructive-foreground': '0 0% 98%',
    '--border': '30 40% 88%', // Light orange-gray border
    '--input': '30 40% 88%',
    '--ring': '15 80% 55%', // Burnt orange
    // Sidebar variables for sunset theme
    '--sidebar-background': '30 75% 94%', // Slightly darker light peach
    '--sidebar-foreground': '20 50% 25%', // Dark warm brown (slightly lighter)
    '--sidebar-primary': '15 80% 55%', // Burnt orange
    '--sidebar-primary-foreground': '30 80% 98%', // Very light peach/white
    '--sidebar-accent': '35 60% 90%', // Darker light orange-tan
    '--sidebar-accent-foreground': '15 70% 30%', // Darker burnt orange
    '--sidebar-border': '30 40% 85%', // Slightly darker border
    '--sidebar-ring': '15 80% 55%', // Burnt orange
  },
  ocean: {
    ...baseVariables,
    '--background': '200 30% 96%', // Very light cool blue
    '--foreground': '210 60% 20%', // Deep blue
    '--card': '195 40% 98%', // Off-white with blue tint
    '--card-foreground': '210 60% 20%',
    '--popover': '195 40% 98%',
    '--popover-foreground': '210 60% 20%',
    '--primary': '205 70% 45%', // Medium blue
    '--primary-foreground': '200 50% 98%', // Very light blue
    '--secondary': '190 35% 92%', // Light cyan-blue
    '--secondary-foreground': '205 60% 35%', // Darker medium blue
    '--muted': '190 35% 92%',
    '--muted-foreground': '200 15% 60%', // Grayish blue
    '--accent': '170 60% 50%', // Teal/aqua
    '--accent-foreground': '170 90% 10%', // Very dark teal
    '--destructive': '350 70% 55%', // Muted cool red
    '--destructive-foreground': '0 0% 98%',
    '--border': '200 25% 88%', // Light blue-gray border
    '--input': '200 25% 88%',
    '--ring': '205 70% 45%', // Medium blue
    // Sidebar variables for ocean theme
    '--sidebar-background': '200 30% 94%', // Slightly darker light cool blue
    '--sidebar-foreground': '210 60% 25%', // Deep blue (slightly lighter)
    '--sidebar-primary': '205 70% 45%', // Medium blue
    '--sidebar-primary-foreground': '200 50% 98%', // Very light blue
    '--sidebar-accent': '190 35% 90%', // Darker light cyan-blue
    '--sidebar-accent-foreground': '205 60% 35%', // Darker medium blue
    '--sidebar-border': '200 25% 85%', // Slightly darker border
    '--sidebar-ring': '205 70% 45%', // Medium blue
  },
};

export type ThemeName = keyof typeof themes;

// Function to apply theme variables to the root element
export const applyTheme = (themeName: ThemeName) => {
  const theme = themes[themeName];
  const root = document.documentElement;

  // Remove existing theme class
  Object.keys(themes).forEach(name => {
    root.classList.remove(`theme-${name}`);
  });

  // Add new theme class
  root.classList.add(`theme-${themeName}`);

  // Apply CSS variables
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Store the selected theme in localStorage
  localStorage.setItem('selectedTheme', themeName);
};

// Function to get the initially saved theme or default
export const getInitialTheme = (): ThemeName => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('selectedTheme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }
  }
  return 'default'; // Default theme if nothing is saved or invalid
};
