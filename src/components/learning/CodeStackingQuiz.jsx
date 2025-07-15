import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Progress, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { createCodeBlocksFromString } from './CodeQuizEngine';
import { useCodeQuizEngine } from './hooks/useCodeQuizEngine';
import { QuizHeader } from './quiz-components/QuizHeader';
import { QuizControls } from './quiz-components/QuizControls';
import { QuizFeedback } from './quiz-components/QuizFeedback';
import { QuizResults } from './quiz-components/QuizResults';
import { AvailableBlocks } from './quiz-components/AvailableBlocks';
import { SolutionArea } from './quiz-components/SolutionArea';
import { QuizStartScreen } from './quiz-components/QuizStartScreen';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Main Quiz Component
const CodeStackingQuiz = ({ 
  code, 
  language = "csharp",
  timeLimit = 120,
  title = "Arrange the Code",
  description = "Drag the code blocks to arrange them in the correct order",
  onComplete,
  splitType = "line", // "line" or "statement"
  difficulty = "medium", // "easy", "medium", "hard" 
  juiciness = "high", // "low", "medium", "high" - visual effects level
  totalBlocks = 0 // Optional - used for completion metrics
}) => {
  const {
    quizState,
    gameEffects,
    screenFlash,
    streakStatus,
    isPaused,
    activeDragBlock,
    dropZoneRefs,
    handleStart,
    handleReset,
    handlePause,
    handleResume,
    handleAbort,
    handleDragStart,
    handleDragEnd
  } = useCodeQuizEngine({
    code,
    splitType,
    difficulty,
    timeLimit,
    juiciness,
    onComplete
  });

  // Configure difficulty settings
  const difficultySettings = {
    easy: { timeLimit: 180, basePoints: 50, penalty: 0.05 },
    medium: { timeLimit: 120, basePoints: 100, penalty: 0.1 },
    hard: { timeLimit: 90, basePoints: 150, penalty: 0.15 }
  };
  
  // Format remaining time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Visual effect controls based on juiciness setting
  const effectsIntensity = {
    low: { scale: 0.3, speed: 0.7, particles: false, sounds: false },
    medium: { scale: 0.7, speed: 1.0, particles: true, sounds: false },
    high: { scale: 1.0, speed: 1.3, particles: true, sounds: true }
  };
  
  const effects = effectsIntensity[juiciness] || effectsIntensity.medium;

  // If no quiz state or code, show loading
  if (!quizState || !code) {
    return (
      <Box textAlign="center" p={10}>
        <Text color="#666">Loading quiz...</Text>
      </Box>
    );
  }

  return (
    <Box position="relative">
      {/* Feedback elements */}
      <QuizFeedback 
        screenFlash={screenFlash}
        streakStatus={streakStatus}
        gameEffects={gameEffects}
        effects={effects}
      />

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="#111"
        border="1px solid #333"
        borderRadius="md"
        overflow="visible" // Important to allow dragging outside of container
        maxW="1000px"
        mx="auto"
        position="relative"
      >
        {/* Quiz Header */}
        <QuizHeader 
          title={title}
          description={description}
          quizState={quizState}
          formatTime={formatTime}
          timeLimit={timeLimit}
        />
        
        {/* Quiz Controls */}
        <QuizControls 
          quizState={quizState}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePause={handlePause}
          handleResume={handleResume}
          handleReset={handleReset}
          handleAbort={handleAbort}
        />
        
        {/* Quiz content */}
        <Box 
          p={4} 
          position="relative" 
          overflow="visible" 
          maxH="600px"
        >
          {quizState.status === 'waiting' && (
            <QuizStartScreen
              title={title}
              description={description}
              timeLimit={timeLimit}
              difficulty={difficulty}
              formatTime={formatTime}
              handleStart={handleStart}
            />
          )}

          {(quizState.status === 'active' || quizState.status === 'paused') && (
            <HStack
              align="start"
              spacing={6}
              h="550px"
              overflow="visible"
              position="relative"
              opacity={quizState.status === 'paused' ? 0.7 : 1}
            >
              {/* Available blocks area */}
              <AvailableBlocks
                blocks={quizState.blocks}
                activeDragBlock={activeDragBlock}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                language={language}
              />
              
              {/* Solution area */}
              <SolutionArea
                userSolution={quizState.userSolution}
                dropZoneRefs={dropZoneRefs}
                activeDragBlock={activeDragBlock}
                gameEffects={gameEffects}
                language={language}
                quizState={quizState}
              />
            </HStack>
          )}
          
          {/* Overlays */}
          {quizState.status === 'paused' && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.7)"
              zIndex={50}
            >
              <VStack spacing={4}>
                <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
                  PAUSED
                </Text>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={handleResume}
                >
                  Resume Quiz
                </Button>
              </VStack>
            </Box>
          )}
          
          {/* Quiz completion overlay */}
          {quizState.status === 'completed' && (
            <QuizResults
              type="complete"
              quizState={quizState}
              handleReset={handleReset}
            />
          )}
          
          {/* Quiz failure overlay */}
          {quizState.status === 'failed' && (
            <QuizResults
              type="failed"
              quizState={quizState}
              handleReset={handleReset}
            />
          )}
        </Box>
      </MotionBox>
    </Box>
  );
};

export default CodeStackingQuiz;