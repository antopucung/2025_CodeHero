import { useTheme as useChakraTheme } from '@chakra-ui/react';
import { useTheme, useThemeTokens as useCustomThemeTokens } from '../ThemeContext';

/**
 * Enhanced hook for accessing theme tokens
 * Provides both Chakra UI theme tokens and our custom theme tokens
 */
export const useThemeTokens = () => {
  const chakraTheme = useChakraTheme();
  const { currentThemeConfig } = useTheme();
  
  // Helper functions for easy token access
  const getColor = (path) => {
    const keys = path.split('.');
    let value = currentThemeConfig.colors;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    
    // Fallback chain: custom theme -> chakra theme -> path as literal value
    return value || 
           (chakraTheme.colors && typeof chakraTheme.colors === 'object' ? 
            keys.reduce((obj, key) => obj?.[key], chakraTheme.colors) : null) || 
           path;
  };
  
  const getSpacing = (size) => {
    return currentThemeConfig.spacing?.[size] || 
           (chakraTheme.space && chakraTheme.space[size]) || 
           size;
  };
  
  const getTypography = (category, property) => {
    return currentThemeConfig.typography?.[category]?.[property] || 
           (chakraTheme[category] && chakraTheme[category][property]) || 
           property;
  };
  
  const getBorderRadius = (size) => {
    return currentThemeConfig.radii?.[size] || 
           (chakraTheme.radii && chakraTheme.radii[size]) || 
           size;
  };
  
  const getShadow = (type) => {
    return currentThemeConfig.shadows?.[type] || 
           (chakraTheme.shadows && chakraTheme.shadows[type]) || 
           type;
  };
  
  const getBreakpoint = (size) => {
    return currentThemeConfig.breakpoints?.[size] || 
           (chakraTheme.breakpoints && chakraTheme.breakpoints[size]) || 
           size;
  };
  
  // Responsive helper
  const responsive = (values) => {
    if (typeof values === 'object' && !Array.isArray(values)) {
      return values; // Already responsive object
    }
    
    if (Array.isArray(values)) {
      const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
      const responsiveObj = {};
      values.forEach((value, index) => {
        if (breakpoints[index]) {
          responsiveObj[breakpoints[index]] = value;
        }
      });
      return responsiveObj;
    }
    
    return values;
  };
  
  // Animation helper
  const getAnimation = (property, value) => {
    return currentThemeConfig.animations?.[property]?.[value] || value;
  };
  
  return {
    // Direct access to theme config
    theme: currentThemeConfig,
    chakraTheme,
    
    // Helper functions
    getColor,
    getSpacing,
    getTypography,
    getBorderRadius,
    getShadow,
    getBreakpoint,
    getAnimation,
    responsive,
    
    // Quick access to common tokens
    colors: currentThemeConfig.colors,
    typography: currentThemeConfig.typography,
    spacing: currentThemeConfig.spacing,
    radii: currentThemeConfig.radii,
    shadows: currentThemeConfig.shadows,
    breakpoints: currentThemeConfig.breakpoints,
    animations: currentThemeConfig.animations,
    
    // Utility functions
    isDark: currentThemeConfig.colorMode === 'dark',
    isLight: currentThemeConfig.colorMode === 'light'
  };
};

// Legacy support for existing useStandardizedTheme
export const useStandardizedTheme = useThemeTokens;

export default useThemeTokens;