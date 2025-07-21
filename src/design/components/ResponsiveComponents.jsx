// Responsive Components - Dynamic adaptive UI components
import React, { forwardRef } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { 
  responsiveContainers, 
  responsiveGrid, 
  responsiveSpacing,
  responsiveUtils,
  mediaQueries 
} from '../system/ResponsiveSystem';
import { designSystem } from '../system/DesignSystem';

const MotionBox = motion(Box);

/**
 * Adaptive Container - Responds to all screen sizes and orientations
 */
export const AdaptiveContainer = forwardRef(({ 
  variant = 'adaptive',
  children, 
  animated = false,
  ...props 
}, ref) => {
  const { isMobile, isTablet, isPortrait, getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  
  // Get container styles based on variant
  const containerStyles = responsiveContainers[variant] || responsiveContainers.adaptive;
  
  // Dynamic padding based on device and orientation
  const dynamicPadding = getResponsiveValue({
    base: isMobile ? (isPortrait ? designSystem.spacing[4] : designSystem.spacing[3]) : designSystem.spacing[6],
    md: isTablet ? designSystem.spacing[6] : designSystem.spacing[8],
    lg: designSystem.spacing[8]
  });
  
  const animationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component
      ref={ref}
      {...containerStyles}
      px={dynamicPadding}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

/**
 * Responsive Grid - Auto-adapts to screen size and content
 */
export const ResponsiveGrid = ({ 
  variant = 'autoFit',
  minWidth = '250px',
  children,
  animated = false,
  ...props 
}) => {
  const { isMobile, isTablet, getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  
  // Adjust minimum width based on device
  const adaptiveMinWidth = getResponsiveValue({
    base: isMobile ? '280px' : minWidth,
    md: isTablet ? '300px' : minWidth,
    lg: minWidth
  });
  
  const gridStyles = variant === 'autoFit' 
    ? responsiveGrid.autoFit(adaptiveMinWidth)
    : variant === 'autoFill'
    ? responsiveGrid.autoFill(adaptiveMinWidth)
    : responsiveGrid[variant] || responsiveGrid.autoFit(adaptiveMinWidth);
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, staggerChildren: 0.1 }
  } : {};
  
  return (
    <Component
      {...gridStyles}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Flexible Stack - Adapts direction based on screen size
 */
export const FlexibleStack = ({ 
  direction = { base: 'column', md: 'row' },
  spacing = 'normal',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  children,
  animated = false,
  ...props 
}) => {
  const { getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  
  const stackSpacing = responsiveSpacing.stack[spacing] || responsiveSpacing.stack.normal;
  const flexDirection = getResponsiveValue(direction);
  
  const animationProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, staggerChildren: 0.05 }
  } : {};
  
  return (
    <Component
      display="flex"
      flexDirection={direction}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap ? 'wrap' : 'nowrap'}
      gap={stackSpacing}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Responsive Text - Scales typography based on screen size
 */
export const ResponsiveText = ({ 
  size = 'base',
  fluidMin,
  fluidMax,
  children,
  ...props 
}) => {
  const { isMobile, getResponsiveValue } = useResponsive();
  
  // Use fluid typography if min/max provided
  const fontSize = fluidMin && fluidMax 
    ? `clamp(${fluidMin}px, ${fluidMin}px + (${fluidMax} - ${fluidMin}) * ((100vw - 320px) / (1200 - 320)), ${fluidMax}px)`
    : getResponsiveValue({
        base: isMobile ? designSystem.typography.sizes[size] : designSystem.typography.sizes[size],
        md: designSystem.typography.sizes[size] || designSystem.typography.sizes.base
      });
  
  return (
    <Box
      as="span"
      fontSize={fontSize}
      fontFamily={designSystem.typography.fonts.mono}
      lineHeight={designSystem.typography.lineHeights.normal}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Adaptive Card - Responds to container size and device type
 */
export const AdaptiveCard = ({ 
  padding = 'normal',
  elevation = 'medium',
  children,
  animated = false,
  hover = false,
  ...props 
}) => {
  const { isMobile, isTouch, getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  
  // Touch-friendly padding on mobile
  const cardPadding = getResponsiveValue({
    base: isMobile ? designSystem.spacing[5] : designSystem.spacing[4],
    md: designSystem.spacing[6],
    lg: designSystem.spacing[8]
  });
  
  // Reduce elevation on mobile for better performance
  const cardElevation = isMobile ? designSystem.shadows.sm : designSystem.shadows[elevation] || designSystem.shadows.md;
  
  const animationProps = {
    ...(animated ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    } : {}),
    ...(hover && !isTouch ? {
      whileHover: { y: -2, boxShadow: designSystem.shadows.lg },
      transition: { duration: 0.2 }
    } : {})
  };
  
  return (
    <Component
      bg={designSystem.colors.backgrounds.elevated}
      borderRadius={designSystem.radii.md}
      border={`1px solid ${designSystem.colors.borders.default}`}
      boxShadow={cardElevation}
      p={cardPadding}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Responsive Sidebar - Adapts to screen size and orientation
 */
export const ResponsiveSidebar = ({ 
  children,
  width = { base: '100%', md: '280px', lg: '320px' },
  collapsible = true,
  defaultCollapsed = false,
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [isCollapsed, setIsCollapsed] = React.useState(
    defaultCollapsed || (collapsible && isMobile)
  );
  
  // Auto-collapse on mobile
  React.useEffect(() => {
    if (collapsible && isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [isMobile, collapsible, isCollapsed]);
  
  return (
    <MotionBox
      width={isCollapsed ? '0' : width}
      minWidth={isCollapsed ? '0' : width}
      overflow="hidden"
      bg={designSystem.colors.backgrounds.secondary}
      borderRight={`1px solid ${designSystem.colors.borders.default}`}
      initial={{ width: isCollapsed ? 0 : width }}
      animate={{ width: isCollapsed ? 0 : width }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      <Box p={isMobile ? designSystem.spacing[4] : designSystem.spacing[6]}>
        {children}
      </Box>
    </MotionBox>
  );
};

/**
 * Viewport Aware Component - Shows/hides based on viewport
 */
export const ViewportAware = ({ 
  showOn = [],
  hideOn = [],
  children,
  fallback = null 
}) => {
  const { currentBreakpoint, isMobile, isTablet, isDesktop, isPortrait, isLandscape } = useResponsive();
  
  const deviceMap = {
    mobile: isMobile,
    tablet: isTablet,
    desktop: isDesktop,
    portrait: isPortrait,
    landscape: isLandscape
  };
  
  // Check if should show
  const shouldShow = showOn.length === 0 || showOn.some(condition => {
    return deviceMap[condition] || currentBreakpoint === condition;
  });
  
  // Check if should hide
  const shouldHide = hideOn.some(condition => {
    return deviceMap[condition] || currentBreakpoint === condition;
  });
  
  if (shouldHide || !shouldShow) {
    return fallback;
  }
  
  return children;
};

/**
 * Responsive Modal - Adapts to screen size and orientation
 */
export const ResponsiveModal = ({ 
  isOpen,
  onClose,
  size = 'adaptive',
  children,
  ...props 
}) => {
  const { isMobile, isPortrait, screenWidth, screenHeight } = useResponsive();
  
  const modalSizes = {
    adaptive: {
      width: isMobile 
        ? (isPortrait ? '95vw' : '90vw')
        : { base: '90vw', md: '80vw', lg: '70vw', xl: '60vw' },
      maxWidth: '900px',
      height: isMobile && isPortrait ? '90vh' : 'auto',
      maxHeight: '90vh'
    },
    fullscreen: {
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      maxHeight: 'none'
    },
    compact: {
      width: isMobile ? '90vw' : '400px',
      height: 'auto',
      maxHeight: '80vh'
    }
  };
  
  const currentSize = modalSizes[size] || modalSizes.adaptive;
  
  return (
    <MotionBox
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0,0,0,0.8)"
      display={isOpen ? 'flex' : 'none'}
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      p={isMobile ? designSystem.spacing[2] : designSystem.spacing[4]}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <MotionBox
        {...currentSize}
        bg={designSystem.colors.backgrounds.elevated}
        borderRadius={designSystem.radii.lg}
        border={`1px solid ${designSystem.colors.borders.default}`}
        boxShadow={designSystem.shadows.lg}
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </MotionBox>
    </MotionBox>
  );
};

// Export all responsive components
export default {
  AdaptiveContainer,
  ResponsiveGrid,
  FlexibleStack,
  ResponsiveText,
  AdaptiveCard,
  ResponsiveSidebar,
  ViewportAware,
  ResponsiveModal
};