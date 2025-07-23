// Main Layout Component - Manages Header and Sidebar positioning
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useThemeTokens } from '../theme/hooks/useThemeTokens';
import { useResponsive } from '../design/hooks/useResponsive';
import Header from '../components/Header';
import Sidebar from '../components/navigation/Sidebar';
import { NAVIGATION_MODES } from '../components/navigation/NavigationConfig';

export const MainLayout = ({ 
  children, 
  navigationMode = NAVIGATION_MODES.BOTH,
  showNavigationModeInfo = false,
  ...props 
}) => {
  const location = useLocation();
  const { getColor } = useThemeTokens();
  const { isMobile, isTablet } = useResponsive();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, isTablet]);
  
  // Determine what navigation components to show
  const showHeader = navigationMode === NAVIGATION_MODES.HEADER_ONLY || 
                    navigationMode === NAVIGATION_MODES.BOTH;
  const showSidebar = navigationMode === NAVIGATION_MODES.SIDEBAR_ONLY || 
                     navigationMode === NAVIGATION_MODES.BOTH;
  
  // Calculate layout dimensions
  const sidebarWidth = showSidebar ? (sidebarCollapsed ? '64px' : '280px') : '0px';
  const headerHeight = showHeader ? '60px' : '0px';
  
  // Handle sidebar navigation
  const handleSidebarNavigate = (item) => {
    // Auto-collapse sidebar on mobile after navigation
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };
  
  const layoutStyles = {
    minH: '100vh',
    bg: getColor('backgrounds.primary'),
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };
  
  const mainContentStyles = {
    flex: 1,
    marginLeft: showSidebar ? sidebarWidth : 0,
    paddingTop: showHeader ? headerHeight : 0,
    transition: 'margin 0.3s ease',
    overflow: 'auto',
    position: 'relative'
  };
  
  return (
    <Box {...layoutStyles} {...props}>
      {/* Navigation Mode Info - Development Helper */}
      {showNavigationModeInfo && (
        <Box
          position="fixed"
          top="10px"
          right="10px"
          bg={getColor('backgrounds.overlay')}
          color={getColor('text.primary')}
          px={3}
          py={1}
          borderRadius="md"
          fontSize="xs"
          zIndex={9999}
          border={`1px solid ${getColor('borders.default')}`}
        >
          Mode: {navigationMode.replace('-', ' ').toUpperCase()}
        </Box>
      )}
      
      {/* Header */}
      {showHeader && (
        <Header 
          hasSidebar={showSidebar}
          sidebarWidth={sidebarWidth}
          isCompact={navigationMode === NAVIGATION_MODES.BOTH}
        />
      )}
      
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={handleSidebarNavigate}
          showToggleButton={true}
        />
      )}
      
      {/* Main Content Area */}
      <Box {...mainContentStyles}>
        {children}
      </Box>
      
      {/* Mobile Overlay */}
      {showSidebar && !sidebarCollapsed && (isMobile || isTablet) && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={999}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </Box>
  );
};

export default MainLayout;