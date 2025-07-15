import React from 'react';
import { VStack, Text, Button } from "@chakra-ui/react";

/**
 * Quiz Start Screen Component - initial welcome screen
 */
export const QuizStartScreen = ({
  title,
  description, 
  timeLimit,
  difficulty,
  formatTime,
  handleStart
}) => {
  return (
    <VStack 
      spacing={6} 
      align="center" 
      justify="center" 
      bg="#111" 
      borderRadius="md" 
      p={8} 
      textAlign="center"
    >
      <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
      <Text color="#ccc" fontSize="md" maxW="500px">
        {description}
      </Text>
      <Text color="#666" fontSize="sm">
        Time Limit: {formatTime(timeLimit)} | Difficulty: {difficulty}
      </Text>
      <Button
        colorScheme="green"
        size="lg"
        onClick={handleStart}
        px={8}
      >
        Start Quiz
      </Button>
    </VStack>
  );
};