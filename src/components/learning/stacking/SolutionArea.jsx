import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableBlock from "./SortableBlock";

/**
 * SolutionArea - Area where blocks are dropped and arranged
 */
const SolutionArea = ({ 
  blocks, 
  blockIds,
  isDragging
}) => {
  return (
    <Box
      flex="1"
      bg="#000"
      p={4}
      borderRadius="md"
      maxH="100%"
      overflowY="auto"
      border={`1px solid ${isDragging ? "#4ecdc4" : "#333"}`}
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
      
      <SortableContext 
        items={blockIds}
        strategy={verticalListSortingStrategy}
      >
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
            blocks.map((block) => (
              <SortableBlock
                key={block.id}
                id={block.id}
                block={block}
              />
            ))
          )}
        </VStack>
      </SortableContext>
    </Box>
  );
};

export default SolutionArea;