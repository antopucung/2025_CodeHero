import React from 'react';
import { Box, Flex, Text, HStack, Button, Spacer, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { ThemeSelector } from '../theme/components/ThemeSelector';
import { useThemeTokens } from '../theme/hooks/useThemeTokens';
import { useResponsive } from '../design/hooks/useResponsive';

function Header({ 
  hasSidebar = false, 
  sidebarWidth = '0px', 
  isCompact = false,
  onToggleSidebar,
  ...props 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getColor, getSpacing, getShadow } = useThemeTokens();
  const { isMobile } = useResponsive();

  // Enhanced navigation handler with detailed logging
  const handleNavigation = (to) => {
    console.log('=== HEADER NAVIGATION DEBUG ===');
    console.log('Current location.pathname:', location.pathname);
    console.log('Target navigation path:', to);
    console.log('Navigate function available:', typeof navigate);
    console.log('Button clicked at:', new Date().toISOString());
    
    try {
      navigate(to);
      console.log('Navigate function called successfully');
      
      // Check if navigation actually happened (delayed check)
      setTimeout(() => {
        console.log('After navigation - Current pathname:', window.location.pathname);
        console.log('React Router location:', location.pathname);
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
    }
    
    console.log('=== END NAVIGATION DEBUG ===');
  };

  // Reduced nav links when sidebar is present to avoid duplication
  const getNavLinks = () => {
    if (hasSidebar && isCompact) {
      // Show only essential items in header when sidebar is present
      return [
        { to: '/profile', label: 'Profile' }
      ];
    }
    
    // Full navigation when no sidebar
    return [
      { to: '/', label: 'Home' },
      { to: '/marketplace', label: 'Marketplace' },
      { to: '/community', label: 'Community' },
      { to: '/profile', label: 'Profile' }
    ];
  };
  
  const navLinks = getNavLinks();
  
  const headerStyles = {
    position: hasSidebar ? 'fixed' : 'static',
    top: hasSidebar ? 0 : 'auto',
    left: hasSidebar ? sidebarWidth : 0,
    right: hasSidebar ? 0 : 'auto',
    w: hasSidebar ? `calc(100% - ${sidebarWidth})` : '100%',
    bg: getColor('backgrounds.primary'),
    borderBottom: `1px solid ${getColor('borders.default')}`,
    px: getSpacing(4),
    py: getSpacing(3),
    zIndex: 999,
    transition: 'all 0.3s ease',
    boxShadow: hasSidebar ? getShadow('sm') : 'none'
  };

  return (
    <Box 
      {...headerStyles}
      {...props}
    >
      <Flex alignItems="center" maxW={hasSidebar ? '100%' : 'container.xl'} mx={hasSidebar ? 0 : 'auto'}>
        {/* Logo - Hide when sidebar is present to avoid duplication */}
        {!hasSidebar && (
          <Text fontSize="xl" fontWeight="bold" color={getColor('brand.primary')}>
            Terminal IDE
          </Text>
        )}
        
        <Spacer />
        
        <HStack spacing={getSpacing(4)} align="center">
          <ThemeSelector compact />
          
          {/* Navigation Links */}
          {!isMobile && navLinks.map((link) => (
            <Button
              key={link.to}
              onClick={() => handleNavigation(link.to)}
              variant={location.pathname === link.to ? "solid" : "ghost"}
              colorScheme="green"
              size="sm"
              bg={location.pathname === link.to ? getColor('interactive.active') : "transparent"}
              color={location.pathname === link.to ? getColor('brand.primary') : getColor('text.muted')}
              _hover={{ 
                color: getColor('brand.primary'), 
                bg: getColor('backgrounds.surface') 
              }}
              cursor="pointer"
              _active={{ transform: "none" }}
            >
              {link.label}
            </Button>
          ))}
          
          {/* Mobile menu button when no sidebar */}
          {isMobile && !hasSidebar && (
            <IconButton
              icon="☰"
              size="sm"
              variant="ghost"
              color={getColor('text.muted')}
              _hover={{ color: getColor('text.primary') }}
              aria-label="Menu"
            />
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;