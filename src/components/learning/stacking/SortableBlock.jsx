import React from "react";
import { Box, Text as ChakraText } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * SortableBlock - A draggable and sortable code block for the solution area
 */
const SortableBlock = ({ 
  block, 
  id,
  isCorrect = true
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      bg={isCorrect ? "#003300" : "#330000"}
      border={`1px solid ${isCorrect ? "#00ff00" : "#ff0000"}`}
      borderRadius="md"
      p={2}
      mb={1}
      cursor="grab"
      _active={{ cursor: "grabbing" }}
      style={style}
      data-block-id={id}
      className="solution-block"
      role="listitem"
      aria-label={`Code block: ${block.content.substring(0, 20)}${block.content.length > 20 ? '...' : ''}`}
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

export default SortableBlock;