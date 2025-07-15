import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Component to show an animated highlight when dragging over a drop zone
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
        <Text fontSize="xs" color={color} fontWeight="bold" textShadow="0 0 8px #000">
          DROP HERE
        </Text>
      </Box>
    </MotionBox>
  );
};

export default DropZoneHighlight;