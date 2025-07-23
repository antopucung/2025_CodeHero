import React, { useState } from 'react';
import { Box, Flex, HStack, VStack, IconButton, Collapse, useDisclosure } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeTokens } from '../theme/hooks/useThemeTokens';
import { useResponsive } from '../design/hooks/useResponsive';
import { ThemeSelector } from '../theme/components/ThemeSelector';
import { CustomText } from '../design/components/Typography';
import { Button } from '../design/components/Button';

const MotionBox = motion(Box);

// Navigation configuration - clean and centralized
const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠', path: '/' },
  { id: 'marketplace', label: 'Marketplace', icon: '🛒', path: '/marketplace' },
  { id: 'editor', label: 'Editor', icon: '💻', path: '/code-editor' },
  { id: 'community', label: 'Community', icon: '🌐', path: '/community' },
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
];

// Responsive Navigation Item Component
const NavItem = ({ item, isActive, onClick, variant = 'desktop' }) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: getSpacing(2),
    px: variant === 'mobile' ? getSpacing(4) : getSpacing(3),
    py: variant === 'mobile' ? getSpacing(3) : getSpacing(2),
    borderRadius: getBorderRadius('md'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    bg: isActive ? getColor('brand.primary') : 'transparent',
    color: isActive ? getColor('text.inverse') : getColor('text.secondary'),
    _hover: {
      bg: isActive ? getColor('brand.primary') : getColor('backgrounds.surface'),
      color: isActive ? getColor('text.inverse') : getColor('brand.primary'),
      transform: 'translateY(-1px)'
    },
    _active: {
      transform: 'translateY(0)'
    }
  };
  
  const iconSize = variant === 'mobile' ? 'lg' : 'md';
  const textSize = variant === 'mobile' ? 'md' : 'sm';
  
  return (
    <MotionBox
      {...baseStyles}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box fontSize={iconSize}>{item.icon}</Box>
      <CustomText 
        size={textSize} 
        fontWeight={isActive ? 'bold' : 'medium'}
        color="inherit"
      >
        {item.label}
      </CustomText>
    </MotionBox>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const { getColor, getSpacing, getBorderRadius, getShadow } = useThemeTokens();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <MotionBox
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            zIndex={998}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Mobile Menu */}
          <MotionBox
            position="fixed"
            top="60px"
            left="0"
            right="0"
            bg={getColor('backgrounds.elevated')}
            border={`1px solid ${getColor('borders.default')}`}
            borderTop="none"
            boxShadow={getShadow('lg')}
            zIndex={999}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VStack spacing={0} p={getSpacing(4)} align="stretch">
              {NAVIGATION_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  variant="mobile"
                />
              ))}
            </VStack>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Header Component
function Header({ 
  hasSidebar = false, 
  sidebarWidth = '0px', 
  isCompact = false,
  ...props 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getColor, getSpacing, getShadow } = useThemeTokens();
  const { isMobile, isTablet, getResponsiveValue } = useResponsive();
  const { isOpen: isMobileMenuOpen, onToggle: toggleMobileMenu, onClose: closeMobileMenu } = useDisclosure();

  // Enhanced navigation handler with error handling
  const handleNavigation = (path) => {
    try {
      navigate(path);
      closeMobileMenu(); // Auto-close mobile menu after navigation
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Responsive header styles using design system
  const headerStyles = {
    position: hasSidebar ? 'fixed' : 'static',
    top: hasSidebar ? 0 : 'auto',
    left: hasSidebar ? sidebarWidth : 0,
    right: hasSidebar ? 0 : 'auto',
    w: hasSidebar ? `calc(100% - ${sidebarWidth})` : '100%',
    h: '60px',
    bg: getColor('backgrounds.primary'),
    borderBottom: `1px solid ${getColor('borders.default')}`,
    boxShadow: getShadow('sm'),
    zIndex: 1000,
    transition: 'all 0.3s ease'
  };

  // Responsive container styles
  const containerStyles = {
    h: '100%',
    maxW: hasSidebar ? '100%' : 'container.xl',
    mx: hasSidebar ? 0 : 'auto',
    px: getResponsiveValue({
      base: getSpacing(4),
      md: getSpacing(6),
      lg: getSpacing(8)
    })
  };

  return (
    <>
      <Box {...headerStyles} {...props}>
        <Flex {...containerStyles} alignItems="center" justifyContent="space-between">
          {/* Logo Section */}
          <MotionBox
            whileHover={{ scale: 1.02 }}
            cursor="pointer"
            onClick={() => handleNavigation('/')}
          >
            <CustomText 
              size={getResponsiveValue({ base: 'lg', md: 'xl' })} 
              fontWeight="bold" 
              color="brand"
            >
              Terminal IDE
            </CustomText>
          </MotionBox>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={getSpacing(2)} flex={1} justify="center">
              {NAVIGATION_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  variant="desktop"
                />
              ))}
            </HStack>
          )}

          {/* Right Section */}
          <HStack spacing={getSpacing(3)}>
            <ThemeSelector compact />
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                icon={isMobileMenuOpen ? "✕" : "☰"}
                size="md"
                variant="ghost"
                color={getColor('text.secondary')}
                _hover={{ 
                  color: getColor('brand.primary'),
                  bg: getColor('backgrounds.surface')
                }}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              />
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        currentPath={location.pathname}
        onNavigate={handleNavigation}
      />
    </>
  );
}

export default Header;