import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Drop Zone for placing code blocks
const DropZone = React.forwardRef(({ index, children, isActive, highlightColor = "#4ecdc4" }, ref) => {
  return (
    <Box
      ref={ref}
      bg={isActive ? `${highlightColor}11` : "transparent"}
      border="2px dashed"
      borderColor={isActive ? highlightColor : "#333"}
      borderWidth="2px"
      borderRadius="md"
      minH="50px"
      p={2}
      mb={2}
      position="relative"
      transition="all 0.2s ease"
      zIndex={isActive ? 1 : 2} // Lower z-index when active to allow dragged items to appear above
      _hover={{
        borderColor: isActive ? highlightColor : "#666"
      }}
      data-dropzone-index={index}
      className="drop-zone"
    >
      {children}
      {isActive && !children && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={`${highlightColor}11`}
          borderRadius="md"
          border={`1px dashed ${highlightColor}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          zIndex={0} // Behind draggable elements but visible
        >
          <Text fontSize="xs" color={highlightColor} fontWeight="bold">
            DROP HERE
          </Text>
        </Box>
      )}
    </Box>
  );
});

DropZone.displayName = 'DropZone';

export default DropZone;