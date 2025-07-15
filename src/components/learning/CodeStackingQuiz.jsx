import React from 'react';
import { Box, VStack, HStack, Text, Button, Progress, Badge } from '@chakra-ui/react';
import { useCodeQuizEngine } from './hooks/useCodeQuizEngine';
import QuizHeader from './quiz-components/QuizHeader';
import QuizControls from './quiz-components/QuizControls';
import QuizFeedback from './quiz-components/QuizFeedback';
import QuizResults from './quiz-components/QuizResults';
import QuizStartScreen from './quiz-components/QuizStartScreen';
import AvailableBlocks from './quiz-components/AvailableBlocks';
import SolutionArea from './quiz-components/SolutionArea';

const CodeStackingQuiz = ({
  code,
  language = "csharp",
  timeLimit = 120,
  title = "Arrange the Code",
  description = "Drag the code blocks to arrange them in the correct order",
  splitType = "line",
  difficulty = "medium",
  onComplete,
  juiciness = "high"
}) => {
  const {
    quizState,
    gameEffects,
    screenFlash,
    streakStatus,
    isPaused,
    activeDragBlock,
    isDraggingBlock,
    dropZoneRefs,
    handleStart,
    handleReset,
    handlePause,
    handleResume,
    handleAbort,
    handleBlockDragStart,
    handleBlockDragEnd,
    handleDropOnZone,
    checkPlacement
  } = useCodeQuizEngine({
    code,
    splitType,
    difficulty,
    timeLimit,
    juiciness,
    onComplete
  });

  if (!quizState) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading quiz...</Text>
      </Box>
    );
  }

  // Render start screen
  if (quizState.status === 'ready') {
    return (
      <QuizStartScreen
        title={title}
        description={description}
        difficulty={difficulty}
        timeLimit={timeLimit}
        onStart={handleStart}
        onAbort={handleAbort}
      />
    );
  }

  // Render results screen
  if (quizState.status === 'completed' || quizState.status === 'timeout') {
    return (
      <QuizResults
        quizState={quizState}
        gameEffects={gameEffects}
        onReset={handleReset}
        onAbort={handleAbort}
      />
    );
  }

  // Render main quiz interface
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      position="relative"
      overflow="hidden"
    >
      {/* Screen flash effect */}
      {screenFlash.active && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={screenFlash.type === 'success' ? 'green.400' : 'red.400'}
          opacity={screenFlash.intensity * 0.3}
          pointerEvents="none"
          zIndex={1000}
        />
      )}

      {/* Streak status */}
      {streakStatus.active && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={999}
          textAlign="center"
        >
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color="yellow.400"
            textShadow="2px 2px 4px rgba(0,0,0,0.5)"
          >
            {streakStatus.count} STREAK!
          </Text>
        </Box>
      )}

      <VStack spacing={4} p={6} h="100vh">
        {/* Header */}
        <QuizHeader
          title={title}
          quizState={quizState}
          gameEffects={gameEffects}
        />

        {/* Controls */}
        <QuizControls
          quizState={quizState}
          isPaused={isPaused}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onAbort={handleAbort}
        />

        {/* Feedback */}
        <QuizFeedback
          gameEffects={gameEffects}
          screenFlash={screenFlash}
        />

        {/* Main quiz area */}
        <HStack spacing={6} align="start" flex={1} w="100%">
          {/* Available blocks */}
          <Box flex={1}>
            <AvailableBlocks
              blocks={quizState.availableBlocks || []}
              onDragStart={handleBlockDragStart}
              onDragEnd={handleBlockDragEnd}
              activeDragBlock={activeDragBlock}
              isDragging={isDraggingBlock}
              language={language}
            />
          </Box>

          {/* Solution area */}
          <Box flex={1}>
            <SolutionArea
              solution={quizState.solution || []}
              onDrop={handleDropOnZone}
              dropZoneRefs={dropZoneRefs}
              activeDragBlock={activeDragBlock}
              language={language}
            />
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CodeStackingQuiz;