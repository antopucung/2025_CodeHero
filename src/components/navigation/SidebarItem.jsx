// Sidebar Navigation Item Component
import React, { useState } from 'react';
import { Box, Tooltip, Collapse, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';
import { CustomText } from '../../design/components/Typography';

const MotionBox = motion(Box);

export const SidebarItem = ({ 
  item, 
  isCollapsed, 
  isActive,
  onNavigate,
  level = 0 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getColor, getSpacing, getBorderRadius, getTypography } = useThemeTokens();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  
  // Check if this item or any submenu item is active
  const itemIsActive = isActive || (item.submenu && 
    item.submenu.some(subItem => subItem.path === location.pathname));
  
  const handleClick = () => {
    if (item.submenu && !isCollapsed) {
      // Toggle submenu for items with submenus
      setIsSubmenuOpen(!isSubmenuOpen);
    } else if (item.action === 'modal') {
      // Handle special actions (like settings modal)
      if (onNavigate) {
        onNavigate(item);
      }
    } else {
      // Navigate to path
      navigate(item.path);
      if (onNavigate) {
        onNavigate(item);
      }
    }
  };
  
  const getItemStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    w: '100%',
    p: isCollapsed ? getSpacing(3) : getSpacing(3),
    pl: isCollapsed ? getSpacing(3) : getSpacing(3 + level * 2),
    borderRadius: getBorderRadius('md'),
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bg: itemIsActive 
      ? `linear-gradient(90deg, ${getColor('brand.primary')} 0%, ${getColor('brand.primary')}88 100%)`
      : 'transparent',
    color: itemIsActive ? getColor('text.inverse') : getColor('text.secondary'),
    position: 'relative',
    overflow: 'hidden',
    _hover: {
      bg: itemIsActive 
        ? `linear-gradient(90deg, ${getColor('brand.primary')} 0%, ${getColor('brand.primary')}aa 100%)`
        : `linear-gradient(90deg, ${getColor('backgrounds.elevated')} 0%, ${getColor('backgrounds.surface')} 100%)`,
      color: itemIsActive ? getColor('text.inverse') : getColor('text.primary'),
      transform: 'translateX(4px) scale(1.02)',
      boxShadow: itemIsActive 
        ? `0 4px 20px ${getColor('brand.primary')}33, inset 0 1px 0 rgba(255,255,255,0.1)`
        : `0 2px 10px ${getColor('backgrounds.surface')}66`
    },
    _active: {
      transform: 'translateX(2px) scale(0.98)'
    }
  });
  
  // Add premium active indicator
  const activeIndicator = itemIsActive ? (
    <Box
      position="absolute"
      left={0}
      top={0}
      bottom={0}
      w="3px"
      bg={`linear-gradient(180deg, ${getColor('brand.accent')} 0%, ${getColor('brand.primary')} 100%)`}
      borderRadius="0 2px 2px 0"
      boxShadow={`0 0 10px ${getColor('brand.primary')}`}
    />
  ) : null;
  
  const iconStyles = {
    fontSize: getTypography('sizes', 'lg'),
    minW: '24px',
    textAlign: 'center',
    mr: isCollapsed ? 0 : getSpacing(3),
    filter: itemIsActive ? `drop-shadow(0 0 8px ${getColor('brand.primary')})` : 'none',
    transition: 'all 0.2s ease'
  };
  
  const renderMainItem = () => (
    <MotionBox
      {...getItemStyles()}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.02,
        x: 4
      }}
      whileTap={{ 
        scale: 0.98,
        x: 2
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {activeIndicator}
      
      <Box {...iconStyles}>
        {item.icon}
      </Box>
      
      <AnimatePresence>
        {!isCollapsed && (
          <MotionBox
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            flex={1}
            overflow="hidden"
          >
            <CustomText
              size="sm"
              fontWeight={itemIsActive ? 'bold' : 'normal'}
              color="inherit"
              whiteSpace="nowrap"
              textShadow={itemIsActive ? `0 1px 2px rgba(0,0,0,0.5)` : 'none'}
            >
              {item.label}
            </CustomText>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Submenu indicator */}
      {item.submenu && !isCollapsed && (
        <MotionBox
          animate={{ 
            rotate: isSubmenuOpen ? 90 : 0,
            scale: isSubmenuOpen ? 1.1 : 1
          }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          fontSize="xs"
          color="inherit"
          opacity={0.8}
          filter={itemIsActive ? `drop-shadow(0 0 4px ${getColor('brand.primary')})` : 'none'}
        >
          ◆
        </MotionBox>
      )}
      
      {/* Premium hover effect overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={`linear-gradient(90deg, transparent 0%, ${getColor('brand.primary')}08 50%, transparent 100%)`}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.3s ease"
        pointerEvents="none"
      />
    </MotionBox>
  );
  
  if (isCollapsed) {
    return (
      <Tooltip
        label={
          <VStack spacing={1} align="start">
            <CustomText size="sm" fontWeight="bold">
              {item.label}
            </CustomText>
            <CustomText size="xs" opacity={0.8}>
              {item.description}
            </CustomText>
          </VStack>
        }
        placement="right"
        bg={getColor('backgrounds.elevated')}
        color={getColor('text.primary')}
        borderRadius={getBorderRadius('md')}
        p={getSpacing(3)}
        border={`1px solid ${getColor('borders.default')}`}
        boxShadow={`${getShadow('lg')}, 0 0 20px ${getColor('brand.primary')}22`}
        hasArrow
        openDelay={300}
        arrowShadowColor={getColor('backgrounds.elevated')}
      >
        {renderMainItem()}
      </Tooltip>
    );
  }
  
  return (
    <Box w="100%">
      {renderMainItem()}
      
      {/* Submenu */}
      {item.submenu && (
        <Collapse in={isSubmenuOpen} animateOpacity>
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <VStack 
              spacing={1} 
              align="stretch" 
              mt={2} 
              pl={getSpacing(4)}
              borderLeft={`2px solid ${getColor('borders.subtle')}`}
              ml={getSpacing(3)}
              position="relative"
            >
              {/* Submenu connector line */}
              <Box
                position="absolute"
                left="-2px"
                top={getSpacing(2)}
                w="2px"
                h={`calc(100% - ${getSpacing(4)})`}
                bg={`linear-gradient(180deg, ${getColor('brand.accent')} 0%, transparent 100%)`}
              />
              
            {item.submenu.map((subItem) => (
              <SidebarItem
                key={subItem.id}
                item={subItem}
                isCollapsed={false}
                isActive={subItem.path === location.pathname}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
            </VStack>
          </MotionBox>
        </Collapse>
      )}
    </Box>
  );
};

export default SidebarItem;