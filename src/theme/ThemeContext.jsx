import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createTheme } from './ThemeFactory';
import { THEME_PRESETS } from './presets/ThemePresets';

// Theme Context
const ThemeContext = createContext({
  currentTheme: 'terminal',
  availableThemes: [],
  switchTheme: () => {},
  customizeTheme: () => {},
  resetTheme: () => {}
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    // Load theme from localStorage or default to 'terminal'
    return localStorage.getItem('selected-theme') || 'terminal';
  });
  
  const [customThemes, setCustomThemes] = useState(() => {
    // Load custom themes from localStorage
    const saved = localStorage.getItem('custom-themes');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Get current theme configuration
  const getCurrentTheme = () => {
    const presetTheme = THEME_PRESETS[currentThemeId];
    const customTheme = customThemes[currentThemeId];
    
    if (customTheme) {
      return { ...presetTheme, ...customTheme, id: currentThemeId };
    }
    
    return presetTheme || THEME_PRESETS.terminal;
  };
  
  // Create Chakra theme from current configuration
  const chakraTheme = createTheme(getCurrentTheme());
  
  // Available themes (presets + custom)
  const availableThemes = [
    ...Object.keys(THEME_PRESETS).map(id => ({
      id,
      name: THEME_PRESETS[id].name,
      description: THEME_PRESETS[id].description,
      isCustom: false
    })),
    ...Object.keys(customThemes).map(id => ({
      id,
      name: customThemes[id].name || id,
      description: customThemes[id].description || 'Custom theme',
      isCustom: true
    }))
  ];
  
  // Switch theme
  const switchTheme = (themeId) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('selected-theme', themeId);
  };
  
  // Customize current theme
  const customizeTheme = (customizations) => {
    const newCustomThemes = {
      ...customThemes,
      [currentThemeId]: {
        ...customThemes[currentThemeId],
        ...customizations
      }
    };
    
    setCustomThemes(newCustomThemes);
    localStorage.setItem('custom-themes', JSON.stringify(newCustomThemes));
  };
  
  // Reset theme to preset
  const resetTheme = (themeId = currentThemeId) => {
    const newCustomThemes = { ...customThemes };
    delete newCustomThemes[themeId];
    
    setCustomThemes(newCustomThemes);
    localStorage.setItem('custom-themes', JSON.stringify(newCustomThemes));
  };
  
  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem('custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);
  
  const contextValue = {
    currentTheme: currentThemeId,
    currentThemeConfig: getCurrentTheme(),
    availableThemes,
    switchTheme,
    customizeTheme,
    resetTheme
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <ChakraProvider theme={chakraTheme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme tokens directly
export const useThemeTokens = () => {
  const { currentThemeConfig } = useTheme();
  return currentThemeConfig;
};

export default ThemeProvider;