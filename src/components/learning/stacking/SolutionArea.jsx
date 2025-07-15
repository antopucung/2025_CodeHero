import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import DraggableBlock from "./DraggableBlock";

/**
 * SolutionArea - Area where blocks are dropped and arranged
 * 
 * @param {Object} props - Component props
 * @param {Array} props.blocks - Array of placed block objects
 * @param {boolean} props.isDragging - Whether a block is being dragged
 * @param {Function} props.onDragOver - Function to call when dragging over
 * @param {Function} props.onDrop - Function to call when a block is dropped
 * @param {React.RefObject} props.containerRef - Ref for the container element
 * @returns {JSX.Element} - Rendered component
 */
const SolutionArea = ({ 
  blocks, 
  isDragging, 
  onDragOver, 
  onDrop,
  containerRef
}) => {
  return (
    <Box
      ref={containerRef}
      flex="1"
      bg="#000"
      p={4}
      borderRadius="md"
      maxH="100%"
      overflowY="auto"
      border={`1px solid ${isDragging ? "#4ecdc4" : "#333"}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      position="relative"
      role="region"
      aria-label="Solution area"
    >
      <Text color="#666" mb={3} fontWeight="bold">
        Your Solution:
      </Text>
      
      {/* Drop indicator overlay */}
      {isDragging && (
        <Box
          position="absolute"
          top="30px"
          left="4px"
          right="4px"
          bottom="4px"
          borderRadius="md"
          border="2px dashed #4ecdc4"
          bg="rgba(78, 205, 196, 0.1)"
          pointerEvents="none"
          zIndex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="#4ecdc4" fontSize="sm">
            Drop to place block
          </Text>
        </Box>
      )}
      
      <VStack 
        align="stretch" 
        spacing={1} 
        zIndex={2} 
        position="relative"
        role="list"
        aria-label="Placed code blocks"
      >
        {blocks.length === 0 ? (
          <Text color="#666" textAlign="center" py={10}>
            {isDragging ? "Drop your first block here" : "Drag blocks here to build your solution"}
          </Text>
        ) : (
          blocks.map((block, index) => (
            <Box
              key={block.id}
              className="solution-block"
              data-index={index}
            >
              <DraggableBlock 
                block={block} 
                isPlaced={true} 
              />
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default SolutionArea;