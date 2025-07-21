// Component System - Standardized component patterns and variants
import { designSystem } from './DesignSystem';
import { responsiveBreakpoints, responsiveSpacing } from './ResponsiveSystem';

/**
 * Standardized component variants and styling patterns
 * Centralizes all component styling to avoid inline styles and ensure consistency
 */

// Typography variants - removes need for inline font styling
const typographyVariants = {
  pageTitle: {
    fontSize: designSystem.typography.sizes['3xl'],
    fontWeight: designSystem.typography.weights.bold,
    color: designSystem.colors.brand.primary,
    fontFamily: designSystem.typography.fonts.mono,
    lineHeight: designSystem.typography.lineHeights.tight
  },
  
  sectionTitle: {
    fontSize: designSystem.typography.sizes.xl,
    fontWeight: designSystem.typography.weights.bold,
    color: designSystem.colors.brand.secondary,
    fontFamily: designSystem.typography.fonts.mono
  },
  
  cardTitle: {
    fontSize: designSystem.typography.sizes.lg,
    fontWeight: designSystem.typography.weights.bold,
    color: designSystem.colors.text.primary,
    fontFamily: designSystem.typography.fonts.mono
  },
  
  bodyText: {
    fontSize: designSystem.typography.sizes.base,
    color: designSystem.colors.text.secondary,
    fontFamily: designSystem.typography.fonts.mono,
    lineHeight: designSystem.typography.lineHeights.normal
  },
  
  caption: {
    fontSize: designSystem.typography.sizes.sm,
    color: designSystem.colors.text.muted,
    fontFamily: designSystem.typography.fonts.mono
  },
  
  label: {
    fontSize: designSystem.typography.sizes.xs,
    color: designSystem.colors.text.muted,
    fontFamily: designSystem.typography.fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};

// Layout variants - standardizes spacing and structure
const layoutVariants = {
  page: {
    maxW: { base: '100%', xl: '1200px' },
    mx: 'auto',
    p: responsiveSpacing.dynamic(6),
    bg: designSystem.colors.backgrounds.primary,
    minH: '100vh',
    position: 'relative'
  },
  
  section: {
    mb: responsiveSpacing.dynamic(8),
    p: responsiveSpacing.dynamic(6),
    bg: designSystem.colors.backgrounds.secondary,
    borderRadius: designSystem.radii.lg,
    border: `1px solid ${designSystem.colors.borders.default}`,
    width: '100%'
  },
  
  card: {
    bg: designSystem.colors.backgrounds.elevated,
    borderRadius: designSystem.radii.md,
    border: `1px solid ${designSystem.colors.borders.default}`,
    p: responsiveSpacing.dynamic(6),
    boxShadow: designSystem.shadows.md,
    width: '100%'
  },
  
  grid: {
    display: 'grid',
    gap: responsiveSpacing.dynamic(6),
    gridTemplateColumns: {
      base: '1fr',
      md: 'repeat(2, 1fr)',
      lg: 'repeat(3, 1fr)',
      xl: 'repeat(4, 1fr)'
    },
    width: '100%'
  },
  
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: responsiveSpacing.dynamic(4),
    width: '100%'
  },
  
  hstack: {
    display: 'flex',
    alignItems: 'center',
    gap: responsiveSpacing.dynamic(4),
    flexWrap: { base: 'wrap', md: 'nowrap' }
  }
};

// Interactive variants - standardizes interactive elements
const interactiveVariants = {
  button: {
    primary: {
      bg: designSystem.colors.brand.primary,
      color: designSystem.colors.text.inverse,
      border: 'none',
      borderRadius: designSystem.radii.base,
      px: responsiveSpacing.dynamic(6),
      py: responsiveSpacing.dynamic(3),
      fontSize: { base: designSystem.typography.sizes.sm, md: designSystem.typography.sizes.base },
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: responsiveSpacing.touchFriendly.minTouchTarget,
      _hover: {
        bg: designSystem.colors.interactive.hover,
        transform: 'translateY(-1px)',
        boxShadow: designSystem.shadows.md
      },
      _active: {
        transform: 'translateY(0)',
        bg: designSystem.colors.interactive.active
      }
    },
    
    secondary: {
      bg: designSystem.colors.backgrounds.surface,
      color: designSystem.colors.text.primary,
      border: `1px solid ${designSystem.colors.borders.default}`,
      borderRadius: designSystem.radii.base,
      px: responsiveSpacing.dynamic(6),
      py: responsiveSpacing.dynamic(3),
      fontSize: { base: designSystem.typography.sizes.sm, md: designSystem.typography.sizes.base },
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: responsiveSpacing.touchFriendly.minTouchTarget,
      _hover: {
        borderColor: designSystem.colors.brand.primary,
        color: designSystem.colors.brand.primary,
        transform: 'translateY(-1px)'
      }
    },
    
    ghost: {
      bg: 'transparent',
      color: designSystem.colors.text.secondary,
      border: 'none',
      borderRadius: designSystem.radii.base,
      px: responsiveSpacing.dynamic(4),
      py: responsiveSpacing.dynamic(2),
      fontSize: designSystem.typography.sizes.sm,
      fontFamily: designSystem.typography.fonts.mono,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: responsiveSpacing.touchFriendly.minTouchTarget,
      _hover: {
        bg: designSystem.colors.backgrounds.surface,
        color: designSystem.colors.text.primary
      }
    }
  },
  
  link: {
    color: designSystem.colors.brand.primary,
    textDecoration: 'none',
    fontFamily: designSystem.typography.fonts.mono,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    _hover: {
      color: designSystem.colors.brand.accent,
      textDecoration: 'underline'
    }
  },
  
  input: {
    bg: designSystem.colors.backgrounds.surface,
    border: `1px solid ${designSystem.colors.borders.default}`,
    borderRadius: designSystem.radii.base,
    px: responsiveSpacing.dynamic(4),
    py: responsiveSpacing.dynamic(3),
    fontSize: { base: designSystem.typography.sizes.sm, md: designSystem.typography.sizes.base },
    fontFamily: designSystem.typography.fonts.mono,
    color: designSystem.colors.text.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
    minHeight: responsiveSpacing.touchFriendly.minTouchTarget,
    width: '100%',
    _focus: {
      borderColor: designSystem.colors.brand.primary,
      boxShadow: `0 0 0 1px ${designSystem.colors.brand.primary}`,
      bg: designSystem.colors.backgrounds.elevated
    },
    _placeholder: {
      color: designSystem.colors.text.muted
    }
  }
};

// Status variants - standardizes status indicators
const statusVariants = {
  badge: {
    success: {
      bg: designSystem.colors.status.success,
      color: designSystem.colors.text.inverse,
      px: responsiveSpacing.dynamic(3),
      py: responsiveSpacing.dynamic(1),
      borderRadius: designSystem.radii.base,
      fontSize: designSystem.typography.sizes.xs,
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    
    warning: {
      bg: designSystem.colors.status.warning,
      color: designSystem.colors.text.inverse,
      px: responsiveSpacing.dynamic(3),
      py: responsiveSpacing.dynamic(1),
      borderRadius: designSystem.radii.base,
      fontSize: designSystem.typography.sizes.xs,
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    
    error: {
      bg: designSystem.colors.status.error,
      color: designSystem.colors.text.inverse,
      px: responsiveSpacing.dynamic(3),
      py: responsiveSpacing.dynamic(1),
      borderRadius: designSystem.radii.base,
      fontSize: designSystem.typography.sizes.xs,
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    
    info: {
      bg: designSystem.colors.status.info,
      color: designSystem.colors.text.inverse,
      px: responsiveSpacing.dynamic(3),
      py: responsiveSpacing.dynamic(1),
      borderRadius: designSystem.radii.base,
      fontSize: designSystem.typography.sizes.xs,
      fontWeight: designSystem.typography.weights.bold,
      fontFamily: designSystem.typography.fonts.mono,
      display: 'inline-block',
      whiteSpace: 'nowrap'
    }
  },
  
  progress: {
    bg: designSystem.colors.backgrounds.surface,
    h: '8px',
    borderRadius: designSystem.radii.base,
    overflow: 'hidden',
    width: '100%',
    position: 'relative'
  }
};

// Animation variants - standardizes motion patterns
const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  },
  
  hover: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  }
};

// Utility functions for applying variants
export const applyVariant = (type, variant) => {
  const variantMap = {
    typography: typographyVariants,
    layout: layoutVariants,
    interactive: interactiveVariants,
    status: statusVariants,
    animation: animationVariants
  };
  
  return variantMap[type]?.[variant] || {};
};

export const createStyledComponent = (baseComponent, variants) => {
  return (props) => {
    const { variant, size, ...otherProps } = props;
    const variantStyles = variants[variant] || variants.default || {};
    const sizeStyles = variants.sizes?.[size] || {};
    
    return baseComponent({
      ...variantStyles,
      ...sizeStyles,
      ...otherProps
    });
  };
};

// Export all variants for easy access
export {
  typographyVariants,
  layoutVariants,
  interactiveVariants,
  statusVariants,
  animationVariants
};