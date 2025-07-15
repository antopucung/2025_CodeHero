import React from "react";
import { Box, Text as ChakraText } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core"; 
import { CSS } from "@dnd-kit/utilities";

/**
 * DraggableBlock - A draggable code block for the available blocks panel
 */
const DraggableBlock = ({ 
  block,
  id
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id,
    data: {
      block
    }
  });

  // Enhanced style with hardware acceleration and anti-stretching properties
  const style = {
    transform: CSS.Transform.toString(transform),
    WebkitTransform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    // Critical properties to prevent stretching
    willChange: 'transform',
    transformOrigin: 'center center',
    touchAction: 'none', 
    userSelect: 'none',
    // Remove transitions during drag to avoid conflicts
    transition: isDragging ? 'none' : undefined
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      bg="#222"
      border="1px solid #444"
      borderRadius="md"
      p={2}
      mb={1}
      cursor="grab"
      _hover={{ borderColor: "#4ecdc4" }}
      _active={{ cursor: "grabbing" }}
      style={style}
      data-block-id={id}
      className="code-block draggable-block"
      role="listitem"
      aria-label={`Code block: ${block.content.substring(0, 20)}${block.content.length > 20 ? '...' : ''}`}
      sx={{
        // Force hardware acceleration
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        // Prevent default browser behaviors
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        // Prevent deformation
        '&:active': {
          transform: `${CSS.Transform.toString(transform)} !important`,
          scale: '1 !important'
        }
      }}
    >
      <ChakraText
        fontFamily="monospace"
        fontSize="sm"
        color="#ccc"
        pl={(block.indentation || 0) / 2 + "px"}
        whiteSpace="pre"
      >
        {block.content}
      </ChakraText>
    </Box>
  );
};

export default DraggableBlock;