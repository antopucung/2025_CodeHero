// Standard Page Layout Component
import React from 'react';
import { Box } from '@chakra-ui/react';
import { designSystem } from '../system/DesignSystem';

export const PageLayout = ({ 
  children, 
  padding = 'default',
  maxWidth = 'default',
  background = 'primary',
  ...props 
}) => {
  const paddingMap = {
    none: 0,
    sm: designSystem.spacing[4],
    default: designSystem.spacing[6],
    lg: designSystem.spacing[8]
  };
  
  const maxWidthMap = {
    sm: '640px',
    md: '768px', 
    default: '1200px',
    lg: '1280px',
    full: '100%'
  };
  
  return (
    <Box
      w="100%"
      h="100%"
      bg={designSystem.colors.backgrounds[background]}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Box
        flex={1}
        overflow="auto"
        p={paddingMap[padding]}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          w="100%"
          maxW={maxWidthMap[maxWidth]}
          flex={1}
          display="flex"
          flexDirection="column"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export const SectionLayout = ({ 
  children, 
  spacing = 'default',
  align = 'stretch',
  ...props 
}) => {
  const spacingMap = {
    tight: designSystem.spacing[4],
    default: designSystem.spacing[6],
    loose: designSystem.spacing[8]
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={spacingMap[spacing]}
      alignItems={align}
      {...props}
    >
      {children}
    </Box>
  );
};

export const GridLayout = ({ 
  children, 
  columns = { base: 1, md: 2, lg: 3 }, 
  gap = 'default',
  ...props 
}) => {
  const gapMap = {
    sm: designSystem.spacing[3],
    default: designSystem.spacing[6],
    lg: designSystem.spacing[8]
  };
  
  return (
    <Box
      display="grid"
      gridTemplateColumns={columns}
      gap={gapMap[gap]}
      w="100%"
      {...props}
    >
      {children}
    </Box>
  );
};