import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import DraggableBlock from "./DraggableBlock";

/**
 * BlocksPanel - Panel containing available blocks to drag
 * 
 * @param {Object} props - Component props
 * @param {Array} props.blocks - Array of block objects
 * @param {Function} props.onDragStart - Function to call when dragging starts
 * @returns {JSX.Element} - Rendered component
 */
const BlocksPanel = ({ blocks, onDragStart }) => {
  return (
    <Box
      flex="1"
      bg="#000"
      p={4}
      borderRadius="md"
      maxH="100%"
      overflowY="auto"
      border="1px solid #333"
      role="region"
      aria-label="Available code blocks"
    >
      <Text color="#666" mb={3} fontWeight="bold">
        Available Blocks:
      </Text>
      
      <VStack 
        align="stretch" 
        spacing={2} 
        role="list"
        aria-label="Draggable code blocks"
      >
        {blocks.map((block) => (
          <DraggableBlock 
            key={block.id} 
            block={block} 
            onDragStart={onDragStart}
          />
        ))}

        {blocks.length === 0 && (
          <Text color="#666" textAlign="center" p={4}>
            All blocks placed!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default BlocksPanel;