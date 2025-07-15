import React from 'react';
import { Box, VStack, Text } from "@chakra-ui/react";
import DraggableCodeBlock from '../DraggableCodeBlock';

/**
 * AvailableBlocks Component - displays the blocks available to be placed
 */
export const AvailableBlocks = ({ 
  blocks, 
  onDragStart, 
  onDragEnd, 
  activeDragBlock, 
  language 
}) => {
  return (
    <Box 
      w="45%" 
      overflow="auto" 
      position="relative" 
      bg="#0a0a0a" 
      p={3} 
      borderRadius="md" 
      h="100%"
    >
      <Text color="#666" fontSize="sm" mb={2}>Drag Blocks:</Text>
      <VStack align="stretch" spacing={2} overflow="visible">
        {blocks.map((block) => (
          <DraggableCodeBlock
            key={block.id}
            block={block}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={activeDragBlock?.id === block.id}
            isPlaced={false}
            language={language}
          />
        ))}
        {blocks.length === 0 && (
          <Text color="#666" fontSize="sm" textAlign="center" py={4}>
            All blocks placed!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default AvailableBlocks;