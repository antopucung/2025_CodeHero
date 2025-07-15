import React from 'react';
import { HStack, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CustomText } from '../../../design/components/Typography';

const MotionBox = motion.div;

/**
 * Quiz Header Component - displays title, description, timer and score
 */
export const QuizHeader = ({ 
  title, 
  description, 
  quizState,
  formatTime,
  timeLimit
}) => {
  return (
    <HStack 
      bg="#111" 
      p={3} 
      borderBottom="1px solid #333"
      justify="space-between"
    >
      <VStack align="start" spacing={1}>
        <CustomText color="#00ff00" fontWeight="bold" fontSize="sm">
          {title}
        </CustomText>
        <CustomText color="#666" fontSize="xs">
          {description}
        </CustomText>
      </VStack>
      
      {quizState.status === 'active' && (
        <VStack spacing={1} align="end">
          <HStack>
            <CustomText color={quizState.timeRemaining < 10 ? "#ff6b6b" : "#ccc"} fontSize="sm">
              Time: {formatTime ? formatTime(quizState.timeRemaining) : quizState.timeRemaining}
            </CustomText>
            <CustomText color="#ffd93d" fontSize="sm">
              Score: {quizState.score}
            </CustomText>
          </HStack>
          <MotionBox
            w="200px"
            h="6px"
            bg="#333"
            borderRadius="full"
            overflow="hidden"
          >
            <MotionBox
              h="100%"
              bg="#00ff00"
              animate={{ 
                width: `${(quizState.timeRemaining / (timeLimit || 120)) * 100}%`,
                backgroundColor: quizState.timeRemaining < 10 ? "#ff6b6b" : "#00ff00"
              }}
              transition={{ duration: 0.3 }}
            />
          </MotionBox>
        </VStack>
      )}
    </HStack>
  );
};

export default QuizHeader;