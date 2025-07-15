import React from 'react';
import { HStack, Button } from "@chakra-ui/react";

/**
 * Quiz Controls Component - handles start, pause, resume, reset, and abort actions
 */
export const QuizControls = ({ 
  quizState,
  isPaused,
  handleStart,
  handlePause,
  handleResume,
  handleReset,
  handleAbort
}) => {
  return (
    <HStack 
      justify="flex-end" 
      p={3} 
      spacing={2}
      bg="#111" 
      borderBottom="1px solid #333"
    >
      {quizState.status === 'waiting' && (
        <Button
          colorScheme="green"
          size="sm"
          onClick={handleStart}
        >
          Start Quiz
        </Button>
      )}
      
      {quizState.status === 'active' && (
        <Button
          size="sm"
          colorScheme="yellow"
          onClick={handlePause}
        >
          Pause
        </Button>
      )}
      
      {quizState.status === 'paused' && (
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleResume}
        >
          Resume
        </Button>
      )}
    
      {(quizState.status === 'completed' || quizState.status === 'failed') && (
        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleReset}
        >
          Reset Quiz
        </Button>
      )}
      
      {(quizState.status === 'active' || quizState.status === 'paused') && (
        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={handleAbort}
        >
          Close Quiz
        </Button>
      )}
    </HStack>
  );
};