import React, { forwardRef } from 'react';
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Drop zone highlight effect component
const DropZoneHighlight = ({ isActive, color = "#4ecdc4" }) => {
  if (!isActive) return null;
  
  return (
    <MotionBox
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      borderRadius="md"
      pointerEvents="none"
      zIndex={5}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.3, 0.7, 0.3],
        borderColor: [color, `${color}aa`, color]
      }}
      transition={{ 
        opacity: { repeat: Infinity, duration: 1 },
        borderColor: { repeat: Infinity, duration: 1.5 }
      }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={`${color}11`}
        border={`2px dashed ${color}`}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          fontSize="xs"
          color={color}
          fontWeight="bold"
          textShadow="0 0 8px #000"
          zIndex={10}
        >
          DROP HERE
        </Box>
      </Box>
    </MotionBox>
  );
};

// Drop zone component for code blocks
const DropZone = forwardRef(({ 
  index, 
  children, 
  isActive = false,
  highlightColor = "#4ecdc4",
  onDrop,
  ...props 
}, ref) => {
  const handleDrop = () => {
    if (onDrop && isActive) {
      onDrop(index);
    }
  };

  return (
    <MotionBox
      ref={ref}
      position="relative"
      minH={children ? "auto" : "50px"}
      bg={isActive ? "rgba(0, 0, 0, 0.2)" : "transparent"}
      borderRadius="md"
      mb={2}
      p={1}
      display="flex"
      alignItems="center"
      justifyContent={!children ? "center" : "flex-start"}
      onClick={handleDrop}
      cursor={isActive ? "pointer" : "default"}
      transition="all 0.2s ease"
      _hover={{
        bg: isActive ? "rgba(0, 0, 0, 0.3)" : "transparent"
      }}
      {...props}
    >
      {children}
      <DropZoneHighlight isActive={isActive} color={highlightColor} />
    </MotionBox>
  );
});

DropZone.displayName = 'DropZone';

export default DropZone;