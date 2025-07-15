import React from 'react';
import { Box, VStack, Text } from "@chakra-ui/react";
import DraggableCodeBlock from '../DraggableCodeBlock';

/**
 * AvailableBlocks Component - displays the blocks available for dragging
 */
export const AvailableBlocks = ({
  blocks,
  activeDragBlock,
  handleDragStart,
  handleDragEnd,
  language
}) => {
  return (
    <Box 
      w="45%" 
      position="relative" 
      h="100%" 
      display="flex" 
      flexDirection="column" 
      zIndex={3}
      bg="#111"
      overflow="visible"
    >
      <Text color="#666" fontSize="sm" mb={2}>Available Blocks:</Text>
      <Box 
        flex={1} 
        overflowY="auto" 
        ml="30px"
        overflow="visible"
        position="relative"
      >
        {blocks.length > 0 ? (
          <VStack align="start" spacing={1} overflow="visible">
            {blocks.map((block) => (
              <DraggableCodeBlock
                key={`block-${block.id}`}
                block={block}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={activeDragBlock?.id === block.id}
                language={language}
              />
            ))}
          </VStack>
        ) : (
          <Text color="#666" fontSize="sm" textAlign="center" p={4}>
            All blocks have been placed
          </Text>
        )}
      </Box>
    </Box>
  );
};