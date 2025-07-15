import React from 'react';
import { VStack, Text, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.div;

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
  const formattedTime = formatTime ? formatTime(timeLimit) : timeLimit;
  
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
      <MotionBox
        animate={{
          textShadow: [
            "0 0 10px #00ff00",
            "0 0 30px #00ff00",
            "0 0 10px #00ff00"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
      </MotionBox>
      
      <Text color="#ccc" fontSize="md" maxW="500px">
        {description}
      </Text>
      
      <Text color="#666" fontSize="sm">
        Time Limit: {formattedTime} | Difficulty: {difficulty.toUpperCase()}
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

export default QuizStartScreen;