// Standardized Theme Hook - Ensures consistent theming across components
import { useTheme } from '@chakra-ui/react';
import { designSystem } from '../system/DesignSystem';
import { 
  typographyVariants, 
  layoutVariants, 
  interactiveVariants, 
  statusVariants 
} from '../system/ComponentSystem';

/**
 * Hook for accessing standardized theme values
 * Prevents components from hardcoding theme values
 */
export function useStandardizedTheme() {
  const chakraTheme = useTheme();
  
  // Merge Chakra theme with our design system
  const standardizedTheme = {
    ...chakraTheme,
    ...designSystem,
    variants: {
      typography: typographyVariants,
      layout: layoutVariants,
      interactive: interactiveVariants,
      status: statusVariants
    }
  };
  
  // Helper functions for consistent theme access
  const getColor = (colorPath) => {
    const paths = colorPath.split('.');
    return paths.reduce((obj, path) => obj?.[path], designSystem.colors);
  };
  
  const getSpacing = (size) => {
    return designSystem.spacing[size] || size;
  };
  
  const getTypography = (property, value) => {
    return designSystem.typography[property]?.[value] || value;
  };
  
  const getBorderRadius = (size) => {
    return designSystem.radii[size] || size;
  };
  
  const getShadow = (type) => {
    return designSystem.shadows[type] || type;
  };
  
  // Responsive helper
  const responsive = (values) => {
    if (typeof values === 'object' && !Array.isArray(values)) {
      return values; // Already responsive object
    }
    
    // Convert array to responsive object
    if (Array.isArray(values)) {
      const breakpoints = ['base', 'sm', 'md', 'lg', 'xl'];
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
  
  // Component variant helper
  const getVariant = (componentType, variantName) => {
    return standardizedTheme.variants[componentType]?.[variantName] || {};
  };
  
  // Animation timing helper
  const getTransition = (type = 'standard') => {
    const transitions = {
      fast: '0.15s ease',
      standard: '0.2s ease',
      slow: '0.3s ease',
      spring: '0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    return transitions[type] || transitions.standard;
  };
  
  return {
    // Core design system
    colors: designSystem.colors,
    typography: designSystem.typography,
    spacing: designSystem.spacing,
    radii: designSystem.radii,
    shadows: designSystem.shadows,
    breakpoints: designSystem.breakpoints,
    
    // Variants
    variants: standardizedTheme.variants,
    
    // Helper functions
    getColor,
    getSpacing,
    getTypography,
    getBorderRadius,
    getShadow,
    responsive,
    getVariant,
    getTransition,
    
    // Common patterns
    containerStyles: {
      maxW: designSystem.breakpoints.xl,
      mx: 'auto',
      px: getSpacing(6)
    },
    
    cardStyles: getVariant('layout', 'card'),
    buttonStyles: (variant = 'primary') => getVariant('interactive', 'button')[variant],
    
    // Utility functions
    combineStyles: (...styles) => Object.assign({}, ...styles),
    
    // Media queries
    mediaQueries: {
      sm: `@media (min-width: ${designSystem.breakpoints.sm})`,
      md: `@media (min-width: ${designSystem.breakpoints.md})`,
      lg: `@media (min-width: ${designSystem.breakpoints.lg})`,
      xl: `@media (min-width: ${designSystem.breakpoints.xl})`
    }
  };
}

export default useStandardizedTheme;