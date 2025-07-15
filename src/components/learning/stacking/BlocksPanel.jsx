import React from "react";
import { Box, Text as ChakraText, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import DraggableBlock from "./DraggableBlock";

const MotionBox = motion(Box);

/**
 * BlocksPanel - Panel containing available blocks to drag
 */
const BlocksPanel = ({ blocks }) => {
  return (
    <MotionBox
      flex="1"
      bg="#000"
      p={5}
      borderRadius="md"
      maxH="100%"
      overflowY="auto"
      border="1px solid #333"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Available code blocks"
    >
      <ChakraText color="#666" mb={3} fontWeight="bold">
        Available Blocks:
      </ChakraText>
      
      <VStack
        align="stretch"
        spacing={3}
        role="list"
        aria-label="Draggable code blocks"
      >
        {blocks.map((block, index) => (
          <MotionBox
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <DraggableBlock
              key={block.id}
              id={block.id}
              block={block || { content: '', indentation: 0 }}
            />
          </MotionBox>
        ))}

        {blocks.length === 0 && (
          <MotionBox
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.03, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            p={6}
            textAlign="center"
          >
            <ChakraText
              color="#00ff00"
              fontSize="lg"
              fontWeight="bold"
            >
              All blocks placed!
            </ChakraText>
          </MotionBox>
        )}
      </VStack>
    </MotionBox>
  );
};

export default BlocksPanel;