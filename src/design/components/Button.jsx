// Standardized Button Component
import React from 'react';
import { Button as ChakraButton, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';

const MotionButton = motion(ChakraButton);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  animate = true,
  ...props 
}) => {
  const { getColor, getTypography, getBorderRadius } = useThemeTokens();
  
  const getVariantStyles = (variant) => {
    const variants = {
      primary: {
        bg: getColor('brand.primary'),
        color: getColor('text.inverse'),
        _hover: {
          bg: getColor('interactive.hover'),
          transform: 'translateY(-1px)'
        },
        _active: {
          bg: getColor('interactive.active'),
          transform: 'translateY(0)'
        }
      },
      secondary: {
        bg: getColor('backgrounds.surface'),
        color: getColor('text.primary'),
        border: `1px solid ${getColor('borders.default')}`,
        _hover: {
          borderColor: getColor('borders.accent'),
          color: getColor('brand.primary')
        }
      },
      ghost: {
        bg: 'transparent',
        color: getColor('text.secondary'),
        _hover: {
          bg: getColor('backgrounds.surface'),
          color: getColor('text.primary')
        }
      }
    };
    
    return variants[variant] || variants.primary;
  };
  
  const animationProps = animate ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <MotionButton
      fontFamily={getTypography('fonts', 'mono')}
      borderRadius={getBorderRadius('base')}
      transition="all 0.2s ease"
      {...getVariantStyles(variant)}
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
  const { getSpacing, getTypography } = useThemeTokens();
  
  return (
    <Button
      variant={variant}
      size={size}
      display="flex"
      flexDirection="column"
      gap={getSpacing(1)}
      minH={size === 'lg' ? '80px' : '60px'}
      {...props}
    >
      <Box fontSize={size === 'lg' ? 'xl' : 'lg'}>
        {icon}
      </Box>
      <Box 
        fontSize="xs"
        fontWeight={getTypography('weights', 'bold')}
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