// Main Sidebar Component
import React, { useState } from 'react';
import { Box, VStack, Divider, IconButton, Tooltip } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';
import { CustomText } from '../../design/components/Typography';
import { SidebarItem } from './SidebarItem';
import { NAVIGATION_CONFIG, isNavigationItemActive } from './NavigationConfig';

const MotionBox = motion(Box);

export const Sidebar = ({ 
  isCollapsed: externalCollapsed,
  onToggleCollapse,
  onNavigate,
  showToggleButton = true,
  ...props 
}) => {
  const location = useLocation();
  const { getColor, getSpacing, getBorderRadius, getShadow } = useThemeTokens();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };
  
  const sidebarWidth = isCollapsed ? '64px' : '280px';
  
  const sidebarStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    w: sidebarWidth,
    bg: `linear-gradient(180deg, ${getColor('backgrounds.secondary')} 0%, ${getColor('backgrounds.surface')} 100%)`,
    borderRight: `1px solid ${getColor('borders.subtle')}`,
    boxShadow: `${getShadow('lg')}, inset -1px 0 0 ${getColor('borders.accent')}33`,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)'
  };
  
  return (
    <MotionBox
      {...sidebarStyles}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      {/* Sidebar Header */}
      <Box
        p={getSpacing(4)}
        borderBottom={`1px solid ${getColor('borders.subtle')}`}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        minH="64px"
        bg={`linear-gradient(90deg, ${getColor('backgrounds.elevated')}22 0%, transparent 100%)`}
        position="relative"
      >
        {/* Premium accent line */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w="3px"
          bg={`linear-gradient(180deg, ${getColor('brand.primary')} 0%, ${getColor('brand.accent')} 100%)`}
          borderRadius="0 2px 2px 0"
        />
        
        <AnimatePresence>
          {!isCollapsed && (
            <MotionBox
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              overflow="hidden"
              ml={getSpacing(2)}
            >
              <CustomText
                size="lg"
                fontWeight="bold"
                color="brand"
                whiteSpace="nowrap"
                textShadow={`0 0 10px ${getColor('brand.primary')}33`}
              >
                Terminal IDE
              </CustomText>
            </MotionBox>
          )}
        </AnimatePresence>
        
        {showToggleButton && (
          <Tooltip
            label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            placement="right"
            bg={getColor('backgrounds.elevated')}
            color={getColor('text.primary')}
            hasArrow
            borderRadius={getBorderRadius('md')}
          >
            <IconButton
              icon={isCollapsed ? '🠪' : '🠨'}
              size="sm"
              bg={getColor('backgrounds.surface')}
              border={`1px solid ${getColor('borders.default')}`}
              borderRadius={getBorderRadius('md')}
              onClick={handleToggleCollapse}
              color={getColor('text.muted')}
              _hover={{ 
                color: getColor('text.primary'),
                bg: getColor('backgrounds.elevated'),
                borderColor: getColor('brand.primary'),
                transform: 'scale(1.05)',
                boxShadow: `0 0 15px ${getColor('brand.primary')}33`
              }}
              _active={{ transform: 'scale(0.95)' }}
              transition="all 0.2s ease"
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            />
          </Tooltip>
        )}
      </Box>
      
      {/* Main Navigation */}
      <Box flex={1} py={getSpacing(4)} position="relative">
        {/* Premium background pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.03}
          backgroundImage={`radial-gradient(circle at 20% 20%, ${getColor('brand.primary')} 1px, transparent 1px)`}
          backgroundSize="20px 20px"
          pointerEvents="none"
        />
        
        <VStack spacing={1} align="stretch" px={getSpacing(2)} position="relative">
          {/* Primary Navigation */}
          {NAVIGATION_CONFIG.primary.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isNavigationItemActive(item, location.pathname)}
              onNavigate={onNavigate}
            />
          ))}
          
          {/* Divider */}
          <Box py={getSpacing(3)} px={getSpacing(2)}>
            <Box
              h="1px"
              bg={`linear-gradient(90deg, transparent 0%, ${getColor('borders.default')} 20%, ${getColor('borders.accent')} 50%, ${getColor('borders.default')} 80%, transparent 100%)`}
              position="relative"
            >
              <Box
                position="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%, -50%)"
                w="4px"
                h="4px"
                bg={getColor('brand.accent')}
                borderRadius="full"
                boxShadow={`0 0 8px ${getColor('brand.accent')}`}
              />
            </Box>
          </Box>
          
          {/* Secondary Navigation */}
          {NAVIGATION_CONFIG.secondary.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isNavigationItemActive(item, location.pathname)}
              onNavigate={onNavigate}
            />
          ))}
        </VStack>
      </Box>
      
      {/* Footer Navigation */}
      <Box
        borderTop={`1px solid ${getColor('borders.subtle')}`}
        p={getSpacing(2)}
        bg={`linear-gradient(90deg, ${getColor('backgrounds.elevated')}22 0%, transparent 100%)`}
        position="relative"
      >
        {/* Premium footer accent */}
        <Box
          position="absolute"
          left={0}
          top={0}
          right={0}
          h="1px"
          bg={`linear-gradient(90deg, ${getColor('brand.primary')} 0%, ${getColor('brand.accent')} 50%, ${getColor('brand.primary')} 100%)`}
        />
        
        <VStack spacing={1} align="stretch">
          {NAVIGATION_CONFIG.footer.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isNavigationItemActive(item, location.pathname)}
              onNavigate={onNavigate}
            />
          ))}
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default Sidebar;