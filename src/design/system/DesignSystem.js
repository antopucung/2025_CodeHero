// Centralized Design System - Single source of truth
export const designSystem = {
  // Color System - Semantic color assignments
  colors: {
    // Brand colors
    brand: {
      primary: '#00ff00',
      secondary: '#4ecdc4',
      accent: '#ffd93d',
      error: '#ff6b6b',
      warning: '#ffaa00',
      success: '#38A169'
    },
    
    // Background system
    backgrounds: {
      primary: '#000000',
      secondary: '#111111',
      surface: '#1a1a1a',
      elevated: '#2d3748',
      overlay: 'rgba(0, 0, 0, 0.8)'
    },
    
    // Text system
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      muted: '#a0aec0',
      disabled: '#4a5568',
      inverse: '#000000'
    },
    
    // Interactive states
    interactive: {
      default: '#4a5568',
      hover: '#2d3748',
      active: '#1a202c',
      focus: '#3182ce',
      disabled: '#2d3748'
    },
    
    // Status colors
    status: {
      info: '#3182ce',
      success: '#38a169',
      warning: '#d69e2e',
      error: '#e53e3e'
    },
    
    // Border system
    borders: {
      default: '#333333',
      subtle: '#2d3748',
      strong: '#4a5568',
      accent: '#00ff00'
    }
  },
  
  // Typography System
  typography: {
    fonts: {
      mono: "'Fira Code', 'Consolas', 'Monaco', monospace",
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px  
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem'      // 48px
    },
    
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7
    }
  },
  
  // Spacing System (8px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },
  
  // Border Radius
  radii: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px rgba(0, 0, 0, 0.1)',
    md: '0 8px 15px rgba(0, 0, 0, 0.15)',
    lg: '0 15px 25px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(0, 255, 0, 0.3)'
  },
  
  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Component Variants
  components: {
    button: {
      sizes: {
        sm: { px: 3, py: 2, fontSize: 'sm' },
        md: { px: 4, py: 2, fontSize: 'base' },
        lg: { px: 6, py: 3, fontSize: 'lg' }
      },
      variants: {
        primary: {
          bg: 'brand.primary',
          color: 'text.inverse',
          _hover: { bg: 'interactive.hover' }
        },
        secondary: {
          bg: 'backgrounds.surface',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'borders.default',
          _hover: { borderColor: 'borders.accent' }
        }
      }
    },
    
    card: {
      variants: {
        default: {
          bg: 'backgrounds.surface',
          border: '1px solid',
          borderColor: 'borders.default',
          borderRadius: 'md',
          p: 4
        },
        elevated: {
          bg: 'backgrounds.elevated',
          border: '1px solid',
          borderColor: 'borders.subtle',
          borderRadius: 'lg',
          boxShadow: 'md'
        }
      }
    }
  }
};

// Utility functions for design system
export const getDesignToken = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], designSystem);
};

export const createVariant = (component, variant, size = 'md') => {
  const comp = designSystem.components[component];
  return {
    ...comp?.variants?.[variant],
    ...comp?.sizes?.[size]
  };
};