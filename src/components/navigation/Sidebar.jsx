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
    bg: getColor('backgrounds.secondary'),
    borderRight: `1px solid ${getColor('borders.default')}`,
    boxShadow: getShadow('md'),
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
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
        borderBottom={`1px solid ${getColor('borders.default')}`}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        minH="60px"
      >
        <AnimatePresence>
          {!isCollapsed && (
            <MotionBox
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              overflow="hidden"
            >
              <CustomText
                size="lg"
                fontWeight="bold"
                color="brand"
                whiteSpace="nowrap"
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
          >
            <IconButton
              icon={isCollapsed ? '▶' : '◀'}
              size="sm"
              variant="ghost"
              onClick={handleToggleCollapse}
              color={getColor('text.muted')}
              _hover={{ 
                color: getColor('text.primary'),
                bg: getColor('backgrounds.surface')
              }}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            />
          </Tooltip>
        )}
      </Box>
      
      {/* Main Navigation */}
      <Box flex={1} overflow="auto" py={getSpacing(4)}>
        <VStack spacing={2} align="stretch" px={getSpacing(2)}>
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
          <Box py={getSpacing(2)}>
            <Divider borderColor={getColor('borders.default')} />
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
        borderTop={`1px solid ${getColor('borders.default')}`}
        p={getSpacing(2)}
      >
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
      
      {/* Resize Handle (Optional) */}
      {!isCollapsed && (
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          w="4px"
          bg="transparent"
          cursor="col-resize"
          _hover={{
            bg: getColor('brand.primary'),
            opacity: 0.5
          }}
          transition="all 0.2s ease"
        />
      )}
    </MotionBox>
  );
};

export default Sidebar;