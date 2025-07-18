import React from 'react';
import { VStack, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CustomText } from '../../../design/components/Typography';

const MotionBox = motion.div;

/**
 * Quiz Results Component - displays completion or failure overlay
 */
export const QuizResults = ({ type = "complete", quizState, handleReset }) => {
  const isComplete = type === "complete";
  
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: [0.95, 1] }}
      transition={{ duration: 0.5, scale: { duration: 0.3, ease: "backOut" } }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20
      }}
    >
      <VStack
        bg="#111"
        border={`3px solid ${isComplete ? "#00ff00" : "#ff6b6b"}`}
        borderRadius="md"
        p={6}
        spacing={4}
        boxShadow={`0 0 30px ${isComplete ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 107, 107, 0.5)"}`}
        maxW="400px"
      >
        <MotionBox
          animate={{
            scale: [1, 1.1, 1], 
            rotate: [0, isComplete ? 5 : 2, isComplete ? -5 : -2, 0],
            textShadow: [
              `0 0 10px ${isComplete ? "#00ff00" : "#ff6b6b"}`, 
              `0 0 ${isComplete ? "30" : "20"}px ${isComplete ? "#00ff00" : "#ff6b6b"}`, 
              `0 0 10px ${isComplete ? "#00ff00" : "#ff6b6b"}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CustomText 
            color={isComplete ? "#00ff00" : "#ff6b6b"} 
            fontSize="2xl" 
            fontWeight="bold"
          >
            {isComplete ? "Quest Complete!" : "Time's Up!"}
          </CustomText>
        </MotionBox>
        
        <VStack spacing={3} align="start" w="100%">
          <HStack justify="space-between" w="100%">
            <CustomText color="#ccc">{isComplete ? "Final Score:" : "Score:"}</CustomText>
            <CustomText color="#ffd93d" fontWeight="bold">{quizState.score}</CustomText>
          </HStack>
          
          {isComplete && (
            <HStack justify="space-between" w="100%">
              <CustomText color="#ccc">Max Combo:</CustomText>
              <CustomText color="#ff6b6b" fontWeight="bold">
                x{quizState.maxComboReached.toFixed(1)}
              </CustomText>
            </HStack>
          )}
          
          <HStack justify="space-between" w="100%">
            <CustomText color="#ccc">{isComplete ? "Correct Placements:" : "Completed:"}</CustomText>
            <CustomText color="#4ecdc4" fontWeight="bold">
              {quizState.correctPlacements}/{quizState.solution.length}
            </CustomText>
          </HStack>
          
          {isComplete && (
            <HStack justify="space-between" w="100%">
              <CustomText color="#ccc">Time Bonus:</CustomText>
              <CustomText color="#00ff00" fontWeight="bold">
                {quizState.feedback.find(f => f.type === 'timeBonus')?.points || 0} pts
              </CustomText>
            </HStack>
          )}
        </VStack>
        
        <Button
          colorScheme={isComplete ? "green" : "blue"}
          size="md"
          onClick={handleReset}
          mt={2}
        >
          Try Again
        </Button>
      </VStack>
    </MotionBox>
  );
};

export default QuizResults;