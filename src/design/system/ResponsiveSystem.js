// Enhanced Responsive System - Dynamic screen adaptation
import { designSystem } from './DesignSystem';

/**
 * Comprehensive responsive utilities for adaptive UI/UX
 * Handles portrait, landscape, and all screen sizes dynamically
 */

// Enhanced breakpoints with device categories
export const responsiveBreakpoints = {
  ...designSystem.breakpoints,
  
  // Device-specific breakpoints
  mobile: '320px',
  mobileLarge: '425px', 
  tablet: '768px',
  tabletLarge: '1024px',
  desktop: '1440px',
  desktopLarge: '2560px',
  
  // Orientation-specific
  mobilePortrait: '(max-width: 768px) and (orientation: portrait)',
  mobileLandscape: '(max-width: 768px) and (orientation: landscape)',
  tabletPortrait: '(min-width: 769px) and (max-width: 1024px) and (orientation: portrait)',
  tabletLandscape: '(min-width: 769px) and (max-width: 1024px) and (orientation: landscape)',
  
  // High DPI displays
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Ultra-wide displays
  ultrawide: '(min-width: 2560px)'
};

// Dynamic container system with adaptive sizing
export const responsiveContainers = {
  // Fluid container that adapts to all screen sizes
  fluid: {
    width: '100%',
    maxWidth: '100vw',
    paddingLeft: { 
      base: designSystem.spacing[4], 
      md: designSystem.spacing[6], 
      lg: designSystem.spacing[8] 
    },
    paddingRight: { 
      base: designSystem.spacing[4], 
      md: designSystem.spacing[6], 
      lg: designSystem.spacing[8] 
    },
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  
  // Adaptive container with max-width constraints
  adaptive: {
    width: '100%',
    maxWidth: {
      base: '100%',
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    paddingX: { base: 4, md: 6, lg: 8 },
    marginX: 'auto'
  },
  
  // Constrained container for optimal reading width
  constrained: {
    width: '100%',
    maxWidth: { base: '100%', md: '768px', lg: '1024px' },
    paddingX: { base: 4, md: 6 },
    marginX: 'auto'
  },
  
  // Full viewport container
  fullscreen: {
    width: '100vw',
    minHeight: '100vh',
    padding: 0,
    margin: 0,
    position: 'relative',
    overflow: 'hidden'
  }
};

// Responsive grid system with auto-sizing
export const responsiveGrid = {
  // Auto-fit grid that adapts to content
  autoFit: (minWidth = '250px') => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
    gap: { base: designSystem.spacing[4], md: designSystem.spacing[6] },
    width: '100%'
  }),
  
  // Auto-fill grid for consistent sizing
  autoFill: (minWidth = '250px') => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
    gap: { base: designSystem.spacing[4], md: designSystem.spacing[6] },
    width: '100%'
  }),
  
  // Responsive column grid
  columns: (cols) => ({
    display: 'grid',
    gridTemplateColumns: {
      base: '1fr',
      sm: cols.sm || 'repeat(2, 1fr)',
      md: cols.md || 'repeat(3, 1fr)',
      lg: cols.lg || 'repeat(4, 1fr)',
      xl: cols.xl || 'repeat(5, 1fr)'
    },
    gap: { base: designSystem.spacing[4], md: designSystem.spacing[6] },
    width: '100%'
  }),
  
  // Masonry-style grid
  masonry: {
    columns: { base: 1, sm: 2, md: 3, lg: 4 },
    columnGap: { base: designSystem.spacing[4], md: designSystem.spacing[6] },
    columnFill: 'balance'
  }
};

// Responsive spacing system
export const responsiveSpacing = {
  // Dynamic spacing based on screen size
  dynamic: (baseSize) => ({
    base: designSystem.spacing[baseSize],
    md: designSystem.spacing[Math.min(baseSize + 2, 24)],
    lg: designSystem.spacing[Math.min(baseSize + 4, 24)]
  }),
  
  // Touch-friendly spacing for mobile
  touchFriendly: {
    minTouchTarget: '44px', // iOS/Android minimum
    padding: { base: designSystem.spacing[4], md: designSystem.spacing[3] },
    margin: { base: designSystem.spacing[3], md: designSystem.spacing[2] }
  },
  
  // Responsive stack spacing
  stack: {
    tight: { base: designSystem.spacing[2], md: designSystem.spacing[3] },
    normal: { base: designSystem.spacing[4], md: designSystem.spacing[6] },
    loose: { base: designSystem.spacing[6], md: designSystem.spacing[8] },
    extraLoose: { base: designSystem.spacing[8], md: designSystem.spacing[12] }
  }
};

// Responsive typography scaling
export const responsiveTypography = {
  // Fluid typography that scales with viewport
  fluid: (minSize, maxSize, minVw = 320, maxVw = 1200) => ({
    fontSize: `clamp(${minSize}px, ${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minVw}px) / (${maxVw} - ${minVw})), ${maxSize}px)`
  }),
  
  // Responsive text sizes
  scale: {
    xs: { base: '12px', md: '14px' },
    sm: { base: '14px', md: '16px' },
    base: { base: '16px', md: '18px' },
    lg: { base: '18px', md: '20px' },
    xl: { base: '20px', md: '24px' },
    '2xl': { base: '24px', md: '30px' },
    '3xl': { base: '30px', md: '36px' },
    '4xl': { base: '36px', md: '48px' },
    '5xl': { base: '48px', md: '64px' }
  },
  
  // Reading-optimized line heights
  reading: {
    tight: { base: 1.2, md: 1.3 },
    normal: { base: 1.4, md: 1.5 },
    relaxed: { base: 1.6, md: 1.7 },
    loose: { base: 1.8, md: 2.0 }
  }
};

// Viewport detection utilities
export const viewportUtils = {
  // Detect current breakpoint
  getCurrentBreakpoint: () => {
    if (typeof window === 'undefined') return 'base';
    
    const width = window.innerWidth;
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 640) return 'sm';
    return 'base';
  },
  
  // Detect orientation
  getOrientation: () => {
    if (typeof window === 'undefined') return 'landscape';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },
  
  // Detect device type
  getDeviceType: () => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },
  
  // Check if touch device
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Get safe area insets (for notched devices)
  getSafeAreaInsets: () => ({
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)'
  })
};

// Responsive utilities for common patterns
export const responsiveUtils = {
  // Hide/show based on breakpoint
  hideBelow: (breakpoint) => ({
    display: { base: 'none', [breakpoint]: 'block' }
  }),
  
  hideAbove: (breakpoint) => ({
    display: { base: 'block', [breakpoint]: 'none' }
  }),
  
  showOnly: (breakpoints) => ({
    display: breakpoints.reduce((acc, bp) => {
      acc[bp] = 'block';
      return acc;
    }, { base: 'none' })
  }),
  
  // Responsive positioning
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  
  // Responsive aspect ratios
  aspectRatio: (ratio) => ({
    position: 'relative',
    width: '100%',
    paddingBottom: `${(1 / ratio) * 100}%`,
    '& > *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  }),
  
  // Responsive images
  responsiveImage: {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    objectFit: 'cover'
  }
};

// CSS custom properties for dynamic theming
export const responsiveCustomProperties = {
  // Dynamic spacing
  '--spacing-xs': { base: '0.25rem', md: '0.5rem' },
  '--spacing-sm': { base: '0.5rem', md: '0.75rem' },
  '--spacing-md': { base: '1rem', md: '1.5rem' },
  '--spacing-lg': { base: '1.5rem', md: '2rem' },
  '--spacing-xl': { base: '2rem', md: '3rem' },
  
  // Dynamic font sizes
  '--font-xs': { base: '0.75rem', md: '0.875rem' },
  '--font-sm': { base: '0.875rem', md: '1rem' },
  '--font-base': { base: '1rem', md: '1.125rem' },
  '--font-lg': { base: '1.125rem', md: '1.25rem' },
  '--font-xl': { base: '1.25rem', md: '1.5rem' },
  
  // Dynamic container widths
  '--container-xs': { base: '100%', sm: '640px' },
  '--container-sm': { base: '100%', md: '768px' },
  '--container-md': { base: '100%', lg: '1024px' },
  '--container-lg': { base: '100%', xl: '1280px' },
  '--container-xl': { base: '100%', '2xl': '1536px' }
};

// Media query helpers
export const mediaQueries = {
  up: (breakpoint) => `@media (min-width: ${responsiveBreakpoints[breakpoint]})`,
  down: (breakpoint) => `@media (max-width: ${responsiveBreakpoints[breakpoint]})`,
  between: (min, max) => `@media (min-width: ${responsiveBreakpoints[min]}) and (max-width: ${responsiveBreakpoints[max]})`,
  only: (breakpoint) => {
    const breakpoints = Object.keys(responsiveBreakpoints);
    const currentIndex = breakpoints.indexOf(breakpoint);
    const nextBreakpoint = breakpoints[currentIndex + 1];
    
    if (!nextBreakpoint) {
      return `@media (min-width: ${responsiveBreakpoints[breakpoint]})`;
    }
    
    return `@media (min-width: ${responsiveBreakpoints[breakpoint]}) and (max-width: ${responsiveBreakpoints[nextBreakpoint]})`;
  },
  
  // Orientation queries
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // Feature queries
  hover: '@media (hover: hover)',
  noHover: '@media (hover: none)',
  pointer: '@media (pointer: fine)',
  coarsePointer: '@media (pointer: coarse)',
  
  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Reduced motion preference
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Dark mode preference
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)'
};

// Export everything for easy access
export default {
  responsiveBreakpoints,
  responsiveContainers,
  responsiveGrid,
  responsiveSpacing,
  responsiveTypography,
  viewportUtils,
  responsiveUtils,
  responsiveCustomProperties,
  mediaQueries
};