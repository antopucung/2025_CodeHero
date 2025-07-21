import { extendTheme } from '@chakra-ui/react';

/**
 * Theme Factory - Creates Chakra UI themes from theme configurations
 * This is the bridge between our custom theme system and Chakra UI
 */
export const createTheme = (themeConfig) => {
  if (!themeConfig) {
    console.warn('No theme config provided, using default');
    return extendTheme({});
  }
  
  const {
    colors,
    typography,
    spacing,
    radii,
    shadows,
    zIndex,
    breakpoints,
    components,
    animations,
    effects
  } = themeConfig;
  
  return extendTheme({
    // Chakra UI configuration
    config: {
      initialColorMode: themeConfig.colorMode || 'dark',
      useSystemColorMode: false,
      disableTransitionOnChange: false
    },
    
    // Colors - map our semantic colors to Chakra's color system
    colors: {
      // Brand colors
      brand: {
        50: colors?.brand?.primary || '#00ff00',
        100: colors?.brand?.primary || '#00ff00',
        200: colors?.brand?.primary || '#00ff00',
        300: colors?.brand?.primary || '#00ff00',
        400: colors?.brand?.primary || '#00ff00',
        500: colors?.brand?.primary || '#00ff00', // Main brand color
        600: colors?.brand?.secondary || '#4ecdc4',
        700: colors?.brand?.secondary || '#4ecdc4',
        800: colors?.brand?.secondary || '#4ecdc4',
        900: colors?.brand?.secondary || '#4ecdc4'
      },
      
      // Semantic colors that map to our design system
      primary: colors?.brand?.primary || '#00ff00',
      secondary: colors?.brand?.secondary || '#4ecdc4',
      accent: colors?.brand?.accent || '#ffd93d',
      error: colors?.brand?.error || '#ff6b6b',
      warning: colors?.brand?.warning || '#ffaa00',
      success: colors?.brand?.success || '#38A169',
      
      // Background colors
      bg: {
        primary: colors?.backgrounds?.primary || '#000000',
        secondary: colors?.backgrounds?.secondary || '#111111',
        surface: colors?.backgrounds?.surface || '#1a1a1a',
        elevated: colors?.backgrounds?.elevated || '#2d3748'
      },
      
      // Text colors
      text: {
        primary: colors?.text?.primary || '#ffffff',
        secondary: colors?.text?.secondary || '#e2e8f0',
        muted: colors?.text?.muted || '#a0aec0',
        disabled: colors?.text?.disabled || '#4a5568',
        inverse: colors?.text?.inverse || '#000000'
      }
    },
    
    // Typography
    fonts: {
      heading: typography?.fonts?.mono || "'Courier New', monospace",
      body: typography?.fonts?.mono || "'Courier New', monospace",
      mono: typography?.fonts?.mono || "'Courier New', monospace"
    },
    
    fontSizes: typography?.sizes || {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    
    fontWeights: typography?.weights || {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    lineHeights: typography?.lineHeights || {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7
    },
    
    // Spacing
    space: spacing || {
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
    
    // Border radius
    radii: radii || {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    
    // Shadows
    shadows: shadows || {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
      base: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 8px 15px rgba(0, 0, 0, 0.15)',
      lg: '0 15px 25px rgba(0, 0, 0, 0.2)',
      glow: '0 0 20px rgba(0, 255, 0, 0.3)'
    },
    
    // Z-index
    zIndices: zIndex || {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060
    },
    
    // Breakpoints
    breakpoints: breakpoints || {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    
    // Global styles
    styles: {
      global: (props) => ({
        body: {
          bg: colors?.backgrounds?.primary || '#000000',
          color: colors?.text?.primary || '#ffffff',
          fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
          fontSize: typography?.sizes?.base || '1rem',
          lineHeight: typography?.lineHeights?.normal || 1.5
        },
        
        // Custom scrollbar styling
        '::-webkit-scrollbar': {
          width: '8px'
        },
        '::-webkit-scrollbar-track': {
          bg: colors?.backgrounds?.surface || '#1a1a1a'
        },
        '::-webkit-scrollbar-thumb': {
          bg: colors?.borders?.default || '#333333',
          borderRadius: 'base'
        },
        '::-webkit-scrollbar-thumb:hover': {
          bg: colors?.borders?.strong || '#4a5568'
        },
        
        // Selection styling
        '::selection': {
          bg: colors?.brand?.primary || '#00ff00',
          color: colors?.text?.inverse || '#000000'
        },
        
        // Focus outline
        '*:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${colors?.brand?.primary || '#00ff00'}`
        }
      })
    },
    
    // Component overrides
    components: {
      // Button component
      Button: {
        baseStyle: {
          fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
          fontWeight: typography?.weights?.bold || 700,
          borderRadius: radii?.base || '0.25rem',
          transition: 'all 0.2s ease'
        },
        variants: {
          solid: {
            bg: colors?.brand?.primary || '#00ff00',
            color: colors?.text?.inverse || '#000000',
            _hover: {
              bg: colors?.interactive?.hover || '#00cc00',
              transform: 'translateY(-1px)'
            },
            _active: {
              bg: colors?.interactive?.active || '#00aa00',
              transform: 'translateY(0)'
            }
          },
          outline: {
            borderColor: colors?.brand?.primary || '#00ff00',
            color: colors?.brand?.primary || '#00ff00',
            _hover: {
              bg: colors?.brand?.primary || '#00ff00',
              color: colors?.text?.inverse || '#000000'
            }
          },
          ghost: {
            color: colors?.text?.secondary || '#e2e8f0',
            _hover: {
              bg: colors?.backgrounds?.surface || '#1a1a1a',
              color: colors?.text?.primary || '#ffffff'
            }
          }
        },
        sizes: {
          sm: { px: 3, py: 2, fontSize: 'sm' },
          md: { px: 4, py: 2, fontSize: 'md' },
          lg: { px: 6, py: 3, fontSize: 'lg' }
        }
      },
      
      // Box component
      Box: {
        baseStyle: {
          fontFamily: typography?.fonts?.mono || "'Courier New', monospace"
        }
      },
      
      // Text component
      Text: {
        baseStyle: {
          fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
          color: colors?.text?.primary || '#ffffff'
        },
        variants: {
          heading: {
            fontWeight: typography?.weights?.bold || 700,
            color: colors?.brand?.primary || '#00ff00'
          },
          subtitle: {
            color: colors?.text?.secondary || '#e2e8f0'
          },
          caption: {
            fontSize: typography?.sizes?.sm || '0.875rem',
            color: colors?.text?.muted || '#a0aec0'
          }
        }
      },
      
      // Input component
      Input: {
        baseStyle: {
          field: {
            fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
            bg: colors?.backgrounds?.surface || '#1a1a1a',
            borderColor: colors?.borders?.default || '#333333',
            color: colors?.text?.primary || '#ffffff',
            _hover: {
              borderColor: colors?.brand?.primary || '#00ff00'
            },
            _focus: {
              borderColor: colors?.brand?.primary || '#00ff00',
              boxShadow: `0 0 0 1px ${colors?.brand?.primary || '#00ff00'}`
            }
          }
        }
      },
      
      // Card component (if using Chakra's Card)
      Card: {
        baseStyle: {
          container: {
            bg: colors?.backgrounds?.elevated || '#2d3748',
            borderRadius: radii?.md || '0.375rem',
            border: `1px solid ${colors?.borders?.default || '#333333'}`,
            boxShadow: shadows?.md || '0 8px 15px rgba(0, 0, 0, 0.15)'
          }
        }
      },
      
      // Modal component
      Modal: {
        baseStyle: {
          dialog: {
            bg: colors?.backgrounds?.elevated || '#2d3748',
            color: colors?.text?.primary || '#ffffff'
          },
          overlay: {
            bg: colors?.backgrounds?.overlay || 'rgba(0, 0, 0, 0.8)'
          }
        }
      },
      
      // Badge component
      Badge: {
        baseStyle: {
          fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
          fontWeight: typography?.weights?.bold || 700
        }
      },
      
      // Progress component
      Progress: {
        baseStyle: {
          track: {
            bg: colors?.backgrounds?.surface || '#1a1a1a'
          },
          filledTrack: {
            bg: colors?.brand?.primary || '#00ff00'
          }
        }
      },
      
      // Tabs component
      Tabs: {
        variants: {
          'soft-rounded': {
            tab: {
              fontFamily: typography?.fonts?.mono || "'Courier New', monospace",
              color: colors?.text?.muted || '#a0aec0',
              _selected: {
                color: colors?.text?.inverse || '#000000',
                bg: colors?.brand?.primary || '#00ff00'
              }
            }
          }
        }
      },
      
      // Apply custom component variants if provided
      ...(components || {})
    },
    
    // Animation and transition settings
    transition: {
      duration: {
        fast: animations?.duration?.fast || '0.15s',
        normal: animations?.duration?.normal || '0.2s',
        slow: animations?.duration?.slow || '0.3s'
      },
      easing: {
        ease: animations?.easing?.ease || 'ease',
        easeIn: animations?.easing?.easeIn || 'ease-in',
        easeOut: animations?.easing?.easeOut || 'ease-out',
        easeInOut: animations?.easing?.easeInOut || 'ease-in-out'
      }
    }
  });
};

export default createTheme;