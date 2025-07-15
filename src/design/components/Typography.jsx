// Typography Components
import React from 'react';
import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react';
import { designSystem } from '../system/DesignSystem';

export const CustomText = ({ 
  variant = 'body', 
  size = 'base',
  color = 'primary',
  ...props 
}) => {
  const colorMap = {
    primary: designSystem.colors.text.primary,
    secondary: designSystem.colors.text.secondary,
    muted: designSystem.colors.text.muted,
    disabled: designSystem.colors.text.disabled,
    brand: designSystem.colors.brand.primary,
    accent: designSystem.colors.brand.accent,
    error: designSystem.colors.brand.error,
    success: designSystem.colors.brand.success
  };
  
  const variantStyles = {
    body: {
      fontFamily: designSystem.typography.fonts.mono,
      lineHeight: designSystem.typography.lineHeights.normal
    },
    caption: {
      fontFamily: designSystem.typography.fonts.mono,
      lineHeight: designSystem.typography.lineHeights.tight,
      fontWeight: designSystem.typography.weights.normal
    },
    code: {
      fontFamily: designSystem.typography.fonts.mono,
      bg: designSystem.colors.backgrounds.secondary,
      px: designSystem.spacing[1],
      py: designSystem.spacing[1],
      borderRadius: designSystem.radii.sm
    }
  };
  
  return (
    <ChakraText
      fontSize={designSystem.typography.sizes[size]}
      color={colorMap[color]}
      {...variantStyles[variant]}
      {...props}
    />
  );
};

export const Heading = ({ 
  level = 1, 
  size = '2xl',
  color = 'primary',
  ...props 
}) => {
  const colorMap = {
    primary: designSystem.colors.text.primary,
    brand: designSystem.colors.brand.primary,
    accent: designSystem.colors.brand.accent
  };
  
  return (
    <ChakraHeading
      as={`h${level}`}
      fontSize={designSystem.typography.sizes[size]}
      fontFamily={designSystem.typography.fonts.mono}
      fontWeight={designSystem.typography.weights.bold}
      lineHeight={designSystem.typography.lineHeights.tight}
      color={colorMap[color]}
      {...props}
    />
  );
};

export const Caption = ({ children, ...props }) => (
  <Text variant="caption" size="xs" color="muted" {...props}>
    {children}
  </Text>
);

export const Code = ({ children, ...props }) => (
  <Text variant="code" size="sm" {...props}>
    {children}
  </Text>
);