import React from 'react';
import { Box, VStack } from "@chakra-ui/react";
import DraggableCodeBlock from '../DraggableCodeBlock';
import DropZone from '../DropZone';
import { CustomText } from '../../../design/components/Typography';

/**
 * SolutionArea Component - displays the area where blocks are arranged
 */
export const SolutionArea = ({
  userSolution,
  dropZoneRefs,
  activeDragBlock,
  gameEffects,
  language,
  quizState,
  onDrop
}) => {
  return (
    <Box 
      w="55%" 
      position="relative" 
      h="100%" 
      display="flex" 
      flexDirection="column" 
      zIndex={2}
      bg="#111"
      overflow="visible"
    >
      <CustomText color="#666" fontSize="sm" mb={2}>Arrange Here:</CustomText>
      <Box 
        flex={1} 
        overflowY="auto" 
        ml="30px" 
        position="relative"
        overflow="visible"
      >
        <VStack align="start" spacing={1} overflow="visible">
          {/* Render drop zones for every possible insertion point */}
          {Array.from({ length: (userSolution?.length || 0) + 1 }).map((_, index) => (
            <Box key={`dropzone-wrapper-${index}`} w="100%" overflow="visible" position="relative">
              <DropZone 
                key={`dropzone-${index}`}
                index={index}
                ref={el => dropZoneRefs && dropZoneRefs[index] ? dropZoneRefs[index] = el : null}
                isActive={!!activeDragBlock}
                highlightColor={gameEffects?.streak >= 3 ? "#ffd93d" : "#4ecdc4"}
                onDrop={onDrop ? () => onDrop(index) : undefined}
              >
                {/* If there's a block at this index in the solution, render it */}
                {index < (userSolution?.length || 0) && userSolution && (
                  <DraggableCodeBlock
                    key={`solution-${userSolution[index].id}`}
                    block={userSolution[index]}
                    isPlaced={true}
                    isCorrect={true} // This will be determined by the quiz engine
                    language={language}
                  />
                )}
                
                {/* If this is an empty drop zone, show a placeholder when active */}
                {index >= (userSolution?.length || 0) && index === 0 && (userSolution?.length || 0) === 0 && (
                  <CustomText color="#666" fontSize="sm">Drop first block here</CustomText>
                )}
              </DropZone>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default SolutionArea;