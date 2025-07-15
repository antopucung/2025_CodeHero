import React, { useState } from 'react';
import { Box, VStack, Button, HStack, Badge, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import QuizManager from '../QuizManager';
import { CustomText } from '../../../design/components/Typography';

const MotionBox = motion(Box);

const DebugChallengeShowcase = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const toast = useToast();

  // Buggy code for the quiz
  const buggyCode = 
`function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 1; i <= numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length();
}

const testScores = [85, 90, 78, 92, 88];
const averageScore = calculateAverage(testScores);
console.log('Average score:', averageScore);`;

  // Fixed code (solution)
  const fixedCode = 
`function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

const testScores = [85, 90, 78, 92, 88];
const averageScore = calculateAverage(testScores);
console.log('Average score:', averageScore);`;

  // Quiz data configuration
  const quizData = {
    type: 'debug-challenge',
    buggyCode: buggyCode,
    fixedCode: fixedCode,
    bugs: [
      'Loop starts at index 1 instead of 0',
      'Loop uses <= instead of <',
      'numbers.length is called as a function',
    ],
    totalBugs: 3,
    language: 'javascript',
    timeLimit: 180,
    difficulty: 'hard',
    title: 'Debug the Code',
    description: 'Find and fix the bugs in this JavaScript function'
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResult(results);
    
    toast({
      title: results.success ? "Debugging complete!" : "Keep searching for bugs!",
      description: `You fixed ${results.bugsFixed} out of ${quizData.totalBugs} bugs and scored ${results.score} points.`,
      status: results.success ? "success" : "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {!showQuiz ? (
        <VStack spacing={6} p={6} bg="#111" borderRadius="md" border="1px solid #333">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <CustomText fontSize="2xl" fontWeight="bold" color="#ff6b6b" mb={2}>
              🔍 Debug Challenge
            </CustomText>
            <CustomText color="#ccc" mb={4}>
              Find and fix the bugs in the code to make it work correctly.
            </CustomText>
          </MotionBox>
          
          <Box 
            as="pre"
            p={4}
            bg="#000"
            borderRadius="md"
            fontSize="sm"
            fontFamily="monospace"
            w="100%"
            overflowX="auto"
            color="#ccc"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: "linear-gradient(to bottom, transparent 70%, #111 100%)",
              pointerEvents: "none"
            }}
          >
            {buggyCode}
          </Box>
          
          <HStack spacing={4}>
            <Button
              bg="#ff6b6b"
              color="#000"
              onClick={() => setShowQuiz(true)}
              _hover={{ bg: "#ff8e8e" }}
            >
              Try This Quiz
            </Button>
          </HStack>
          
          <Box mt={2}>
            <HStack spacing={3}>
              <Badge bg="#333" color="#ccc">Debug</Badge>
              <Badge bg="#333" color="#ccc">JavaScript</Badge>
              <Badge bg="#333" color="#ccc">Problem Solving</Badge>
            </HStack>
          </Box>
        </VStack>
      ) : (
        <VStack spacing={4}>
          <HStack w="100%" justify="space-between">
            <Badge 
              as="button"
              onClick={() => {
                setShowQuiz(false);
                setQuizResult(null);
              }}
              bg="#222"
              color="#ccc"
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: "#333" }}
            >
              ← Back to Showcase
            </Badge>
            
            {quizResult && (
              <HStack>
                <Badge bg={quizResult.success ? "#00ff00" : "#ffd93d"} color="#000">
                  Score: {quizResult.score}
                </Badge>
              </HStack>
            )}
          </HStack>
          
          <Box w="100%" minH="500px" bg="#111" borderRadius="md" overflow="hidden">
            <QuizManager
              quizData={quizData}
              onComplete={handleQuizComplete}
              juiciness="high"
            />
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default DebugChallengeShowcase;