// Typography Components
import React from 'react';
import { Text as ChakraText, Heading as ChakraHeading } from '@chakra-ui/react';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';

export const CustomText = ({ 
  variant = 'body', 
  size = 'base',
  color = 'primary',
  ...props 
}) => {
  const { getColor, getTypography } = useThemeTokens();
  
  const getColorValue = (colorKey) => {
    const colorMap = {
      primary: 'text.primary',
      secondary: 'text.secondary',
      muted: 'text.muted',
      disabled: 'text.disabled',
      brand: 'brand.primary',
      accent: 'brand.accent',
      error: 'brand.error',
      success: 'brand.success'
    };
    
    return getColor(colorMap[colorKey] || colorKey);
  };
  
  const variantStyles = {
    body: {
      fontFamily: getTypography('fonts', 'mono'),
      lineHeight: getTypography('lineHeights', 'normal')
    },
    caption: {
      fontFamily: getTypography('fonts', 'mono'),
      lineHeight: getTypography('lineHeights', 'tight'),
      fontWeight: getTypography('weights', 'normal')
    },
    code: {
      fontFamily: getTypography('fonts', 'mono'),
      bg: getColor('backgrounds.secondary'),
      px: '0.25rem',
      py: '0.25rem',
      borderRadius: 'sm'
    }
  };
  
  return (
    <ChakraText
      fontSize={size}
      color={getColorValue(color)}
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
  const { getColor, getTypography } = useThemeTokens();
  
  const getColorValue = (colorKey) => {
    const colorMap = {
      primary: 'text.primary',
      brand: 'brand.primary',
      accent: 'brand.accent'
    };
    
    return getColor(colorMap[colorKey] || colorKey);
  };
  
  return (
    <ChakraHeading
      as={`h${level}`}
      fontSize={size}
      fontFamily={getTypography('fonts', 'mono')}
      fontWeight={getTypography('weights', 'bold')}
      lineHeight={getTypography('lineHeights', 'tight')}
      color={getColorValue(color)}
      {...props}
    />
  );
};

export const Caption = ({ children, ...props }) => (
  <CustomText variant="caption" size="xs" color="muted" {...props}>
    {children}
  </CustomText>
);

export const Code = ({ children, ...props }) => (
  <CustomText variant="code" size="sm" {...props}>
    {children}
  </CustomText>
);