import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const ProgressBar = ({
  value = 0,
  colorScheme = 'green',
  bg = 'rgba(0,0,0,0.2)',
  height = '8px',
  borderRadius = '4px',
  animated = true,
  ...props
}) => {
  // Get color based on colorScheme
  const getColor = () => {
    const colorSchemes = {
      green: '#38A169',
      blue: '#3182CE',
      red: '#E53E3E',
      purple: '#805AD5',
      yellow: '#D69E2E',
      teal: '#319795',
      cyan: '#00B5D8',
      pink: '#D53F8C',
      orange: '#DD6B20',
      gold: '#FFD700'
    };
    
    return colorSchemes[colorScheme] || colorSchemes.green;
  };
  
  const color = getColor();
  
  return (
    <Box
      w="100%"
      h={height}
      bg={bg}
      borderRadius={borderRadius}
      overflow="hidden"
      {...props}
    >
      {animated ? (
        <MotionBox
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(0, value), 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          h="100%"
          bg={color}
          borderRadius={borderRadius}
        />
      ) : (
        <Box
          w={`${Math.min(Math.max(0, value), 100)}%`}
          h="100%"
          bg={color}
          borderRadius={borderRadius}
          transition="width 0.5s ease-out"
        />
      )}
    </Box>
  );
};