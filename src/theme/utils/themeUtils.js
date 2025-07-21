/**
 * Theme Utilities - Helper functions for theme management
 */

// Color manipulation utilities
export const adjustColor = (color, amount) => {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

export const lightenColor = (color, amount = 20) => adjustColor(color, amount);
export const darkenColor = (color, amount = 20) => adjustColor(color, -amount);

// Convert hex to rgba
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate color palette from base color
export const generateColorPalette = (baseColor) => {
  return {
    50: lightenColor(baseColor, 80),
    100: lightenColor(baseColor, 60),
    200: lightenColor(baseColor, 40),
    300: lightenColor(baseColor, 20),
    400: lightenColor(baseColor, 10),
    500: baseColor,
    600: darkenColor(baseColor, 10),
    700: darkenColor(baseColor, 20),
    800: darkenColor(baseColor, 40),
    900: darkenColor(baseColor, 60)
  };
};

// Theme validation
export const validateTheme = (theme) => {
  const required = [
    'colors.brand.primary',
    'colors.backgrounds.primary',
    'colors.text.primary',
    'typography.fonts.mono',
    'spacing'
  ];
  
  const errors = [];
  
  required.forEach(path => {
    const keys = path.split('.');
    let value = theme;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        errors.push(`Missing required property: ${path}`);
        break;
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Theme merging utility
export const mergeThemes = (baseTheme, overrides) => {
  const merged = JSON.parse(JSON.stringify(baseTheme)); // Deep clone
  
  const mergeObject = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        mergeObject(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };
  
  mergeObject(merged, overrides);
  return merged;
};

// Export theme to JSON
export const exportTheme = (theme) => {
  return JSON.stringify(theme, null, 2);
};

// Import theme from JSON
export const importTheme = (jsonString) => {
  try {
    const theme = JSON.parse(jsonString);
    const validation = validateTheme(theme);
    
    if (!validation.isValid) {
      throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
    }
    
    return theme;
  } catch (error) {
    throw new Error(`Failed to import theme: ${error.message}`);
  }
};

// Generate CSS custom properties from theme
export const generateCSSProperties = (theme) => {
  const cssProps = {};
  
  const flattenObject = (obj, prefix = '') => {
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}-${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flattenObject(value, newKey);
      } else {
        cssProps[`--${newKey}`] = value;
      }
    }
  };
  
  flattenObject(theme);
  return cssProps;
};

// Theme accessibility checker
export const checkAccessibility = (theme) => {
  const issues = [];
  
  // Check contrast ratios (simplified)
  const checkContrast = (bg, text, context) => {
    // This is a simplified check - in production, use a proper contrast ratio library
    const bgHex = bg.replace('#', '');
    const textHex = text.replace('#', '');
    
    const bgLum = parseInt(bgHex, 16);
    const textLum = parseInt(textHex, 16);
    
    if (Math.abs(bgLum - textLum) < 0x404040) {
      issues.push(`Low contrast in ${context}: ${bg} on ${text}`);
    }
  };
  
  // Check primary text on primary background
  if (theme.colors?.backgrounds?.primary && theme.colors?.text?.primary) {
    checkContrast(
      theme.colors.backgrounds.primary,
      theme.colors.text.primary,
      'primary text on primary background'
    );
  }
  
  // Check interactive states have sufficient contrast
  if (theme.colors?.interactive?.hover && theme.colors?.text?.primary) {
    checkContrast(
      theme.colors.interactive.hover,
      theme.colors.text.primary,
      'hover state'
    );
  }
  
  return {
    hasIssues: issues.length > 0,
    issues
  };
};

// Performance optimization - memoize theme calculations
const themeCache = new Map();

export const getCachedTheme = (themeId, themeConfig) => {
  const cacheKey = `${themeId}-${JSON.stringify(themeConfig).slice(0, 100)}`;
  
  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey);
  }
  
  // If cache is getting too large, clear it
  if (themeCache.size > 10) {
    themeCache.clear();
  }
  
  return null;
};

export const setCachedTheme = (themeId, themeConfig, result) => {
  const cacheKey = `${themeId}-${JSON.stringify(themeConfig).slice(0, 100)}`;
  themeCache.set(cacheKey, result);
};

export default {
  adjustColor,
  lightenColor,
  darkenColor,
  hexToRgba,
  generateColorPalette,
  validateTheme,
  mergeThemes,
  exportTheme,
  importTheme,
  generateCSSProperties,
  checkAccessibility,
  getCachedTheme,
  setCachedTheme
};