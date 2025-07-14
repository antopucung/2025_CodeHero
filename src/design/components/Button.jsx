// Standardized Button Component
import React from 'react';
import { Button as ChakraButton, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { designSystem, createVariant } from '../system/DesignSystem';

const MotionButton = motion(ChakraButton);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  animate = true,
  ...props 
}) => {
  const buttonStyles = createVariant('button', variant, size);
  
  const animationProps = animate ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <MotionButton
      fontFamily={designSystem.typography.fonts.mono}
      borderRadius={designSystem.radii.base}
      transition="all 0.2s ease"
      {...buttonStyles}
      {...animationProps}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export const IconButton = ({ 
  icon, 
  label, 
  variant = 'secondary', 
  size = 'md',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      display="flex"
      flexDirection="column"
      gap={designSystem.spacing[1]}
      minH={size === 'lg' ? '80px' : '60px'}
      {...props}
    >
      <Box fontSize={size === 'lg' ? designSystem.typography.sizes.xl : designSystem.typography.sizes.lg}>
        {icon}
      </Box>
      <Box 
        fontSize={designSystem.typography.sizes.xs} 
        fontWeight={designSystem.typography.weights.bold}
      >
        {label}
      </Box>
    </Button>
  );
};

export const NavigationButton = ({ 
  icon, 
  label, 
  isActive = false, 
  ...props 
}) => {
  return (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      size="md"
      w="100%"
      display="flex"
      flexDirection="column"
      gap={designSystem.spacing[1]}
      h="60px"
      bg={isActive ? designSystem.colors.backgrounds.elevated : designSystem.colors.backgrounds.surface}
      color={isActive ? designSystem.colors.brand.primary : designSystem.colors.text.muted}
      borderColor={isActive ? designSystem.colors.brand.primary : designSystem.colors.borders.default}
      _hover={{
        bg: designSystem.colors.backgrounds.elevated,
        borderColor: designSystem.colors.brand.primary,
        color: designSystem.colors.brand.primary
      }}
      {...props}
    >
      <Box fontSize={designSystem.typography.sizes.base}>{icon}</Box>
      <Box 
        fontSize={designSystem.typography.sizes.xs} 
        fontWeight={designSystem.typography.weights.bold}
      >
        {label}
      </Box>
    </Button>
  );
};