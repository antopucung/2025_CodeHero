import React from "react";
import { Box, Text as ChakraText, VStack } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core"; 
import { motion } from "framer-motion";
import DraggableCodeBlock from "../DraggableCodeBlock";

const MotionBox = motion(Box);

/**
 * SolutionArea - Area where blocks are dropped and arranged
 */
const SolutionArea = ({ 
  blocks, 
  isDragging,
  id = "solution-area"
}) => {
  const { setNodeRef } = useDroppable({
    id: id
  });
  
  return (
    <Box
      ref={setNodeRef}
      flex="1"
      bg="#000"
      p={5}
      borderRadius="md"
      maxH="100%"
      overflowY="auto"
      border={`2px solid ${isDragging ? "#4ecdc4" : "#333"}`}
      position="relative"
      transition="all 0.3s ease"
      role="region"
      aria-label="Solution area"
    >
      <ChakraText color="#666" mb={3} fontWeight="bold">
        Your Solution:
      </ChakraText>
      
      {/* Drop indicator overlay */}
      {isDragging && (
        <MotionBox
          position="absolute"
          top="30px"
          left="4px"
          right="4px"
          bottom="4px"
          borderRadius="md"
          border="3px dashed #4ecdc4"
          bg="rgba(78, 205, 196, 0.15)"
          pointerEvents="none"
          zIndex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          animate={{
            boxShadow: [
              "0 0 0px rgba(78, 205, 196, 0.3)",
              "0 0 30px rgba(78, 205, 196, 0.5)",
              "0 0 0px rgba(78, 205, 196, 0.3)"
            ],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MotionBox
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChakraText
              color="#4ecdc4"
              fontSize="md"
              fontWeight="bold"
              textShadow="0 0 10px rgba(78, 205, 196, 0.5)"
            >
            Drop to place block
            </ChakraText>
          </MotionBox>
        </MotionBox>
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
          <MotionBox
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: isDragging ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            py={10}
            textAlign="center"
          >
            <ChakraText 
              color={isDragging ? "#4ecdc4" : "#666"} 
              fontSize={isDragging ? "md" : "sm"}
              fontWeight={isDragging ? "bold" : "normal"}
            >
            {isDragging ? "Drop your first block here" : "Drag blocks here to build your solution"}
            </ChakraText>
          </MotionBox>
        ) : (
          blocks.map((block) => (
            <DraggableCodeBlock
              key={block.id}
              block={block}
              isPlaced={true}
              isCorrect={true}
              language="javascript"
            />
          ))
        )}
      </VStack>
    </Box>
  );
};

export default SolutionArea;