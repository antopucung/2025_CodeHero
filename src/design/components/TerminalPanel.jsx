// Design System - Terminal Panel Component
import React from 'react';
import { Box } from '@chakra-ui/react';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export const TerminalPanel = ({ 
  children, 
  title, 
  variant = 'default',
  padding = 'normal',
  ...props 
}) => {
  const variants = {
    default: {
      bg: colors.terminal.surface,
      border: `1px solid ${colors.terminal.border}`,
      color: colors.terminal.text
    },
    primary: {
      bg: colors.terminal.surface,
      border: `1px solid ${colors.primary[500]}`,
      color: colors.terminal.text,
      boxShadow: `0 0 10px ${colors.primary[500]}33`
    },
    error: {
      bg: colors.terminal.surface,
      border: `1px solid ${colors.performance.error.primary}`,
      color: colors.terminal.text,
      boxShadow: `0 0 10px ${colors.performance.error.primary}33`
    }
  };
  
  const paddings = {
    none: '0',
    small: spacing[2],
    normal: spacing[4],
    large: spacing[6]
  };
  
  const style = variants[variant];
  
  return (
    <Box
      {...style}
      p={paddings[padding]}
      borderRadius="0"
      fontFamily={typography.fonts.mono}
      position="relative"
      {...props}
    >
      {title && (
        <Box
          fontSize={typography.sizes.xs}
          color={colors.terminal.textSecondary}
          mb={spacing[2]}
          fontFamily={typography.fonts.mono}
        >
          │ {title.toUpperCase()}
        </Box>
      )}
      {children}
    </Box>
  );
};

export const TerminalHeader = ({ children, ...props }) => (
  <Box
    fontSize={typography.sizes.xs}
    color={colors.terminal.textSecondary}
    mb={spacing[2]}
    fontFamily={typography.fonts.mono}
    {...props}
  >
    {children}
  </Box>
);

export const TerminalContent = ({ children, ...props }) => (
  <Box
    fontFamily={typography.fonts.mono}
    fontSize={typography.sizes.base}
    {...props}
  >
    {children}
  </Box>
);