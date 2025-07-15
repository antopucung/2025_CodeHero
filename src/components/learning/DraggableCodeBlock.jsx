import React from 'react';
import { Box, Text, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DraggableCodeBlock = ({ 
  block, 
  onDragStart, 
  onDragEnd, 
  isDragging, 
  isPlaced, 
  isCorrect, 
  language = "csharp" 
}) => {
  if (!block) {
    console.error("No block provided to DraggableCodeBlock");
    return null;
  }
  
  const colors = {
    draggable: { bg: "#222", border: "#444", shadow: "0 2px 5px rgba(0, 0, 0, 0.2)" },
    dragging: { bg: "#333", border: "#4ecdc4", shadow: "0 5px 15px rgba(0, 0, 0, 0.3)" },
    placed: { 
      correct: { bg: "#001800", border: "#00ff00", shadow: "0 0 10px rgba(0, 255, 0, 0.3)" },
      incorrect: { bg: "#260000", border: "#ff0000", shadow: "0 0 10px rgba(255, 0, 0, 0.3)" }
    }
  };
  
  let style = colors.draggable;
  if (isDragging) {
    style = colors.dragging;
  } else if (isPlaced) {
    style = isCorrect ? colors.placed.correct : colors.placed.incorrect;
  }

  // Indentation padding - 8px per level of indentation
  const indentationPadding = `${(block.indentation || 0) / 2}px`;
  
  const handleDragStart = () => {
    if (onDragStart && !isPlaced) {
      onDragStart(block);
    }
  };
  
  const handleDragEnd = (event, info) => {
    if (onDragEnd && !isPlaced) {
      onDragEnd(block, info);
    }
  };

  return (
    <MotionBox
      drag={!isPlaced}
      dragSnapToOrigin
      dragElastic={0.7}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: isPlaced ? 1 : 1.02 }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 1000,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)",
        border: "2px solid #4ecdc4"
      }}
      animate={{
        boxShadow: style.shadow,
        borderColor: style.border,
        backgroundColor: style.bg,
        y: isPlaced && isCorrect ? [0, -5, 0] : 0 // Small bounce effect for correct placement
      }}
      transition={{ 
        duration: 0.3,
        y: { duration: 0.5, type: "spring", stiffness: 300 }
      }}
      bg={style.bg}
      border={`1px solid ${style.border}`}
      borderRadius="md"
      p={2}
      cursor={isPlaced ? "default" : "grab"}
      mb={2}
      position="relative"
      zIndex={isDragging ? 1000 : isPlaced ? 2 : 5} // Higher z-index for unplaced blocks
      data-block-id={block.id}
      className="draggable-block"
    >
      {/* Line number */}
      <Text 
        position="absolute" 
        left="-30px" 
        top="50%" 
        transform="translateY(-50%)"
        fontSize="xs"
        color="#666"
      >
        {block.lineNumber || ''}
      </Text>
      
      {/* Code content with syntax highlighting */}
      <Box 
        fontFamily="monospace" 
        fontSize="sm" 
        color="#ccc"
        pl={indentationPadding}
        whiteSpace="pre"
        overflow="hidden"
      >
        {block.content}
      </Box>
      
      {/* Status indicator */}
      {isPlaced && (
        <Badge 
          position="absolute" 
          top={1} 
          right={1}
          bg={isCorrect ? "green.600" : "red.600"}
          color="white"
          fontSize="xs"
          borderRadius="full"
        >
          {isCorrect ? "✓" : "✗"}
        </Badge>
      )}
    </MotionBox>
  );
};

export default DraggableCodeBlock;