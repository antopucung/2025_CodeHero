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
    p: isCollapsed ? getSpacing(3) : getSpacing(4),
    pl: isCollapsed ? getSpacing(3) : getSpacing(4 + level * 2),
    borderRadius: getBorderRadius('md'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    bg: itemIsActive ? getColor('brand.primary') : 'transparent',
    color: itemIsActive ? getColor('text.inverse') : getColor('text.secondary'),
    _hover: {
      bg: itemIsActive ? getColor('brand.primary') : getColor('backgrounds.surface'),
      color: itemIsActive ? getColor('text.inverse') : getColor('text.primary'),
      transform: 'translateX(2px)'
    },
    _active: {
      transform: 'translateX(0px)'
    }
  });
  
  const iconStyles = {
    fontSize: getTypography('sizes', 'lg'),
    minW: '24px',
    textAlign: 'center',
    mr: isCollapsed ? 0 : getSpacing(3)
  };
  
  const renderMainItem = () => (
    <MotionBox
      {...getItemStyles()}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box {...iconStyles}>
        {item.icon}
      </Box>
      
      <AnimatePresence>
        {!isCollapsed && (
          <MotionBox
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            flex={1}
            overflow="hidden"
          >
            <CustomText
              size="sm"
              fontWeight={itemIsActive ? 'bold' : 'medium'}
              color="inherit"
              whiteSpace="nowrap"
            >
              {item.label}
            </CustomText>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Submenu indicator */}
      {item.submenu && !isCollapsed && (
        <MotionBox
          animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          fontSize="xs"
          color="inherit"
          opacity={0.7}
        >
          ▶
        </MotionBox>
      )}
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
        hasArrow
        openDelay={300}
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
          <VStack spacing={1} align="stretch" mt={2} pl={getSpacing(2)}>
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
        </Collapse>
      )}
    </Box>
  );
};

export default SidebarItem;