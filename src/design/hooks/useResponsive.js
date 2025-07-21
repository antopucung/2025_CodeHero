// Enhanced Responsive Hook - Dynamic screen adaptation
import { useState, useEffect, useCallback } from 'react';
import { responsiveBreakpoints, viewportUtils } from '../system/ResponsiveSystem';

/**
 * Comprehensive responsive hook for adaptive UI/UX
 * Provides real-time viewport information and responsive utilities
 */
export const useResponsive = () => {
  // Viewport state
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    breakpoint: typeof window !== 'undefined' ? viewportUtils.getCurrentBreakpoint() : 'lg',
    orientation: typeof window !== 'undefined' ? viewportUtils.getOrientation() : 'landscape',
    deviceType: typeof window !== 'undefined' ? viewportUtils.getDeviceType() : 'desktop',
    isTouch: typeof window !== 'undefined' ? viewportUtils.isTouchDevice() : false,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  }));

  // Update viewport info
  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const newViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      breakpoint: viewportUtils.getCurrentBreakpoint(),
      orientation: viewportUtils.getOrientation(),
      deviceType: viewportUtils.getDeviceType(),
      isTouch: viewportUtils.isTouchDevice(),
      pixelRatio: window.devicePixelRatio || 1
    };
    
    setViewport(newViewport);
  }, []);

  // Listen for viewport changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewport, 150);
    };
    
    // Orientation change handler
    const handleOrientationChange = () => {
      // Delay to ensure viewport dimensions are updated
      setTimeout(updateViewport, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Initial update
    updateViewport();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(resizeTimer);
    };
  }, [updateViewport]);

  // Responsive utilities
  const isBreakpoint = useCallback((breakpoint) => {
    return viewport.breakpoint === breakpoint;
  }, [viewport.breakpoint]);

  const isAboveBreakpoint = useCallback((breakpoint) => {
    const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(viewport.breakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }, [viewport.breakpoint]);

  const isBelowBreakpoint = useCallback((breakpoint) => {
    const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(viewport.breakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex < targetIndex;
  }, [viewport.breakpoint]);

  const isBetweenBreakpoints = useCallback((min, max) => {
    return isAboveBreakpoint(min) && isBelowBreakpoint(max);
  }, [isAboveBreakpoint, isBelowBreakpoint]);

  // Device type checks
  const isMobile = viewport.deviceType === 'mobile';
  const isTablet = viewport.deviceType === 'tablet';
  const isDesktop = viewport.deviceType === 'desktop';
  const isPortrait = viewport.orientation === 'portrait';
  const isLandscape = viewport.orientation === 'landscape';

  // Responsive value resolver
  const getResponsiveValue = useCallback((responsiveValue) => {
    if (typeof responsiveValue !== 'object' || responsiveValue === null) {
      return responsiveValue;
    }
    
    // If it's an array, convert to object
    if (Array.isArray(responsiveValue)) {
      const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
      const obj = {};
      responsiveValue.forEach((value, index) => {
        if (breakpoints[index]) {
          obj[breakpoints[index]] = value;
        }
      });
      responsiveValue = obj;
    }
    
    // Find the appropriate value for current breakpoint
    const breakpoints = ['2xl', 'xl', 'lg', 'md', 'sm', 'base'];
    const currentBreakpointIndex = breakpoints.indexOf(viewport.breakpoint);
    
    // Look for exact match first
    if (responsiveValue[viewport.breakpoint] !== undefined) {
      return responsiveValue[viewport.breakpoint];
    }
    
    // Fallback to smaller breakpoints
    for (let i = currentBreakpointIndex; i < breakpoints.length; i++) {
      const breakpoint = breakpoints[i];
      if (responsiveValue[breakpoint] !== undefined) {
        return responsiveValue[breakpoint];
      }
    }
    
    // Final fallback to base or first available value
    return responsiveValue.base || Object.values(responsiveValue)[0];
  }, [viewport.breakpoint]);

  // Responsive className generator
  const getResponsiveClasses = useCallback((classes) => {
    if (typeof classes === 'string') return classes;
    if (!classes || typeof classes !== 'object') return '';
    
    return Object.entries(classes)
      .filter(([breakpoint, className]) => {
        if (breakpoint === 'base') return viewport.breakpoint === 'base';
        return isAboveBreakpoint(breakpoint);
      })
      .map(([, className]) => className)
      .join(' ');
  }, [viewport.breakpoint, isAboveBreakpoint]);

  // Container queries (when supported)
  const useContainerQuery = useCallback((containerRef, query) => {
    const [matches, setMatches] = useState(false);
    
    useEffect(() => {
      if (!containerRef.current || typeof window === 'undefined') return;
      
      // Fallback: use ResizeObserver to simulate container queries
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          
          // Simple query parsing (extend as needed)
          if (query.includes('min-width')) {
            const minWidth = parseInt(query.match(/min-width:\s*(\d+)px/)?.[1] || '0');
            setMatches(width >= minWidth);
          } else if (query.includes('max-width')) {
            const maxWidth = parseInt(query.match(/max-width:\s*(\d+)px/)?.[1] || '0');
            setMatches(width <= maxWidth);
          }
        }
      });
      
      observer.observe(containerRef.current);
      
      return () => observer.disconnect();
    }, [containerRef, query]);
    
    return matches;
  }, []);

  // Safe area handling (for notched devices)
  const safeAreaInsets = viewportUtils.getSafeAreaInsets();

  return {
    // Viewport information
    viewport,
    
    // Device type checks
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isTouch: viewport.isTouch,
    isRetina: viewport.pixelRatio > 1,
    
    // Breakpoint utilities
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint,
    isBetweenBreakpoints,
    
    // Value resolution
    getResponsiveValue,
    getResponsiveClasses,
    
    // Advanced features
    useContainerQuery,
    safeAreaInsets,
    
    // Update function
    updateViewport,
    
    // Convenience getters
    currentBreakpoint: viewport.breakpoint,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
    aspectRatio: viewport.width / viewport.height
  };
};

// Hook for simple breakpoint detection
export const useBreakpoint = (breakpoint) => {
  const { isAboveBreakpoint } = useResponsive();
  return isAboveBreakpoint(breakpoint);
};

// Hook for orientation detection
export const useOrientation = () => {
  const { isPortrait, isLandscape } = useResponsive();
  return { isPortrait, isLandscape };
};

// Hook for device type detection
export const useDeviceType = () => {
  const { isMobile, isTablet, isDesktop, isTouch } = useResponsive();
  return { isMobile, isTablet, isDesktop, isTouch };
};

export default useResponsive;