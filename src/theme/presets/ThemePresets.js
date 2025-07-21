/**
 * Theme Presets - Pre-defined theme configurations
 * Each preset is a complete theme configuration that can be used with the ThemeFactory
 */

export const THEME_PRESETS = {
  // Original Terminal Theme
  terminal: {
    id: 'terminal',
    name: 'Terminal IDE',
    description: 'Classic terminal-inspired dark theme with green accents',
    colorMode: 'dark',
    
    colors: {
      brand: {
        primary: '#00ff00',
        secondary: '#4ecdc4',
        accent: '#ffd93d',
        error: '#ff6b6b',
        warning: '#ffaa00',
        success: '#38A169'
      },
      
      backgrounds: {
        primary: '#000000',
        secondary: '#111111',
        surface: '#1a1a1a',
        elevated: '#2d3748',
        overlay: 'rgba(0, 0, 0, 0.8)'
      },
      
      text: {
        primary: '#ffffff',
        secondary: '#e2e8f0',
        muted: '#a0aec0',
        disabled: '#4a5568',
        inverse: '#000000'
      },
      
      interactive: {
        default: '#4a5568',
        hover: '#00cc00',
        active: '#00aa00',
        focus: '#00ff00',
        disabled: '#2d3748'
      },
      
      borders: {
        default: '#333333',
        subtle: '#2d3748',
        strong: '#4a5568',
        accent: '#00ff00'
      },
      
      status: {
        info: '#3182ce',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e'
      }
    },
    
    typography: {
      fonts: {
        mono: "'Fira Code', 'Courier New', 'Consolas', 'Monaco', monospace",
        sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      },
      
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
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
    
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
      base: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 8px 15px rgba(0, 0, 0, 0.15)',
      lg: '0 15px 25px rgba(0, 0, 0, 0.2)',
      glow: '0 0 20px rgba(0, 255, 0, 0.3)'
    },
    
    animations: {
      duration: {
        fast: '0.15s',
        normal: '0.2s',
        slow: '0.3s'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },
  
  // Modern Light Theme
  modern: {
    id: 'modern',
    name: 'Modern Light',
    description: 'Clean modern light theme with blue accents',
    colorMode: 'light',
    
    colors: {
      brand: {
        primary: '#3182ce',
        secondary: '#4299e1',
        accent: '#ed8936',
        error: '#e53e3e',
        warning: '#d69e2e',
        success: '#38a169'
      },
      
      backgrounds: {
        primary: '#ffffff',
        secondary: '#f7fafc',
        surface: '#edf2f7',
        elevated: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.6)'
      },
      
      text: {
        primary: '#1a202c',
        secondary: '#4a5568',
        muted: '#718096',
        disabled: '#a0aec0',
        inverse: '#ffffff'
      },
      
      interactive: {
        default: '#e2e8f0',
        hover: '#2c5282',
        active: '#2a4365',
        focus: '#3182ce',
        disabled: '#e2e8f0'
      },
      
      borders: {
        default: '#e2e8f0',
        subtle: '#edf2f7',
        strong: '#cbd5e0',
        accent: '#3182ce'
      },
      
      status: {
        info: '#3182ce',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e'
      }
    },
    
    typography: {
      fonts: {
        mono: "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
        sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      },
      
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      
      lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625
      }
    },
    
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    
    radii: {
      none: '0',
      sm: '0.25rem',
      base: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      base: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 10px 15px rgba(0, 0, 0, 0.1)',
      lg: '0 20px 25px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(49, 130, 206, 0.3)'
    },
    
    animations: {
      duration: {
        fast: '0.1s',
        normal: '0.2s',
        slow: '0.3s'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },
  
  // Cyberpunk Theme
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic cyberpunk theme with neon colors and dark backgrounds',
    colorMode: 'dark',
    
    colors: {
      brand: {
        primary: '#ff0080',
        secondary: '#00ffff',
        accent: '#ffff00',
        error: '#ff3333',
        warning: '#ff8800',
        success: '#00ff88'
      },
      
      backgrounds: {
        primary: '#0a0a0a',
        secondary: '#1a0a1a',
        surface: '#2a1a2a',
        elevated: '#3a2a3a',
        overlay: 'rgba(255, 0, 128, 0.2)'
      },
      
      text: {
        primary: '#ffffff',
        secondary: '#ff80c0',
        muted: '#8080ff',
        disabled: '#404040',
        inverse: '#000000'
      },
      
      interactive: {
        default: '#4a2a4a',
        hover: '#cc0066',
        active: '#aa0055',
        focus: '#ff0080',
        disabled: '#2a1a2a'
      },
      
      borders: {
        default: '#ff0080',
        subtle: '#cc0066',
        strong: '#ff00aa',
        accent: '#00ffff'
      },
      
      status: {
        info: '#00ffff',
        success: '#00ff88',
        warning: '#ff8800',
        error: '#ff3333'
      }
    },
    
    typography: {
      fonts: {
        mono: "'Orbitron', 'Courier New', monospace",
        sans: "'Orbitron', 'Arial', sans-serif"
      },
      
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      
      lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6
      }
    },
    
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 0 10px rgba(255, 0, 128, 0.3)',
      base: '0 0 15px rgba(255, 0, 128, 0.4)',
      md: '0 0 20px rgba(255, 0, 128, 0.5)',
      lg: '0 0 30px rgba(255, 0, 128, 0.6)',
      glow: '0 0 40px rgba(255, 0, 128, 0.8)'
    },
    
    animations: {
      duration: {
        fast: '0.1s',
        normal: '0.15s',
        slow: '0.25s'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },
  
  // Minimal Theme
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, minimal theme with subtle colors and plenty of whitespace',
    colorMode: 'light',
    
    colors: {
      brand: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#718096',
        error: '#e53e3e',
        warning: '#d69e2e',
        success: '#38a169'
      },
      
      backgrounds: {
        primary: '#ffffff',
        secondary: '#fafafa',
        surface: '#f5f5f5',
        elevated: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.4)'
      },
      
      text: {
        primary: '#2d3748',
        secondary: '#4a5568',
        muted: '#718096',
        disabled: '#a0aec0',
        inverse: '#ffffff'
      },
      
      interactive: {
        default: '#e2e8f0',
        hover: '#1a202c',
        active: '#2d3748',
        focus: '#2d3748',
        disabled: '#e2e8f0'
      },
      
      borders: {
        default: '#e2e8f0',
        subtle: '#f7fafc',
        strong: '#cbd5e0',
        accent: '#2d3748'
      },
      
      status: {
        info: '#3182ce',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e'
      }
    },
    
    typography: {
      fonts: {
        mono: "'SF Mono', 'Monaco', 'Inconsolata', monospace",
        sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      },
      
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      
      weights: {
        normal: 300,
        medium: 400,
        semibold: 500,
        bold: 600
      },
      
      lineHeights: {
        tight: 1.3,
        normal: 1.6,
        relaxed: 1.8
      }
    },
    
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    
    radii: {
      none: '0',
      sm: '0.5rem',
      base: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      base: '0 2px 4px rgba(0, 0, 0, 0.05)',
      md: '0 4px 8px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(45, 55, 72, 0.2)'
    },
    
    animations: {
      duration: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.4s'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },
  
  // Gaming Theme
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-contrast gaming theme with RGB accents and dark backgrounds',
    colorMode: 'dark',
    
    colors: {
      brand: {
        primary: '#7c3aed',
        secondary: '#f59e0b',
        accent: '#06b6d4',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      },
      
      backgrounds: {
        primary: '#0f0f0f',
        secondary: '#1a1a1a',
        surface: '#262626',
        elevated: '#404040',
        overlay: 'rgba(124, 58, 237, 0.3)'
      },
      
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af',
        disabled: '#6b7280',
        inverse: '#000000'
      },
      
      interactive: {
        default: '#374151',
        hover: '#5b21b6',
        active: '#4c1d95',
        focus: '#7c3aed',
        disabled: '#374151'
      },
      
      borders: {
        default: '#374151',
        subtle: '#1f2937',
        strong: '#4b5563',
        accent: '#7c3aed'
      },
      
      status: {
        info: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    
    typography: {
      fonts: {
        mono: "'JetBrains Mono', 'Fira Code', monospace",
        sans: "'Inter', sans-serif"
      },
      
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
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
    
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    
    radii: {
      none: '0',
      sm: '0.25rem',
      base: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 0 10px rgba(124, 58, 237, 0.2)',
      base: '0 0 15px rgba(124, 58, 237, 0.3)',
      md: '0 0 20px rgba(124, 58, 237, 0.4)',
      lg: '0 0 30px rgba(124, 58, 237, 0.5)',
      glow: '0 0 40px rgba(124, 58, 237, 0.7)'
    },
    
    animations: {
      duration: {
        fast: '0.1s',
        normal: '0.15s',
        slow: '0.2s'
      },
      easing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
};

export default THEME_PRESETS;