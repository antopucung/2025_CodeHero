import React from "react";
import { Box, Text as ChakraText, VStack } from "@chakra-ui/react";
import DraggableBlock from "./DraggableBlock";

/**
 * BlocksPanel - Panel containing available blocks to drag
 */
const BlocksPanel = ({ blocks }) => {
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
      <ChakraText color="#666" mb={3} fontWeight="bold">
        Available Blocks:
      </ChakraText>
      
      <VStack 
        align="stretch" 
        spacing={2} 
        role="list"
        aria-label="Draggable code blocks"
      >
        {blocks.map((block) => (
          <DraggableBlock 
            key={block.id} 
            id={block.id}
            block={block} 
          />
        ))}

        {blocks.length === 0 && (
          <ChakraText color="#666" textAlign="center" p={4}>
            All blocks placed!
          </ChakraText>
        )}
      </VStack>
    </Box>
  );
};

export default BlocksPanel;