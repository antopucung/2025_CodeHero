import React, { forwardRef } from 'react';
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import DropZoneHighlight from "./DropZoneHighlight";

const MotionBox = motion(Box);

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