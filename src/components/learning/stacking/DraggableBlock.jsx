import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

/**
 * DraggableBlock - A draggable code block component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.block - Block data with content, indentation, etc.
 * @param {boolean} props.isPlaced - Whether block is in the solution area
 * @param {Function} props.onDragStart - Function to call when dragging starts
 * @param {string} props.bgColor - Background color override
 * @param {string} props.borderColor - Border color override
 * @returns {JSX.Element} - Rendered component
 */
const DraggableBlock = ({ 
  block, 
  isPlaced = false,
  onDragStart,
  bgColor,
  borderColor
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";
    
    if (onDragStart) {
      onDragStart(block);
    }
  };

  return (
    <MotionBox
      draggable={!isPlaced}
      onDragStart={handleDragStart}
      bg={bgColor || (isPlaced ? "#003300" : "#222")}
      border={`1px solid ${borderColor || (isPlaced ? "#00ff00" : "#444")}`}
      borderRadius="md"
      p={2}
      mb={1}
      cursor={isPlaced ? "default" : "grab"}
      whileHover={!isPlaced ? { scale: 1.02 } : {}}
      _hover={!isPlaced ? { borderColor: "#4ecdc4" } : {}}
      data-block-id={block.id}
      className="code-block"
      role="listitem"
      aria-label={`Code block: ${block.content.substring(0, 20)}${block.content.length > 20 ? '...' : ''}`}
    >
      <Text
        fontFamily="monospace"
        fontSize="sm"
        color="#ccc"
        pl={(block.indentation || 0) / 2 + "px"}
        whiteSpace="pre"
      >
        {block.content}
      </Text>
    </MotionBox>
  );
};

export default DraggableBlock;