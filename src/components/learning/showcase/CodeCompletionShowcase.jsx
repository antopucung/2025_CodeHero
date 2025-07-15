import React, { useState } from 'react';
import { Box, VStack, Button, HStack, Badge, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import QuizManager from '../QuizManager';
import { CustomText } from '../../../design/components/Typography';

const MotionBox = motion(Box);

const CodeCompletionShowcase = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const toast = useToast();

  // Sample code with blanks for the quiz
  const sampleCodeWithBlanks = 
`function calculateArea(shape, dimensions) {
  if (shape === 'rectangle') {
    return dimensions.__BLANK_0__ * dimensions.__BLANK_1__;
  } else if (shape === 'circle') {
    return Math.PI * __BLANK_2__ * dimensions.radius;
  } else if (shape === 'triangle') {
    return 0.5 * dimensions.base * __BLANK_3__;
  }
  return 0;
}`;

  // Quiz data configuration
  const quizData = {
    type: 'code-completion',
    code: sampleCodeWithBlanks,
    blanks: [
      { lineIndex: 2, startIndex: 34, endIndex: 45, solution: 'width' },
      { lineIndex: 2, startIndex: 58, endIndex: 69, solution: 'height' },
      { lineIndex: 4, startIndex: 24, endIndex: 35, solution: 'dimensions.radius' },
      { lineIndex: 6, startIndex: 36, endIndex: 47, solution: 'dimensions.height' }
    ],
    language: 'javascript',
    timeLimit: 120,
    difficulty: 'medium',
    title: 'Complete the Code',
    description: 'Fill in the blanks to complete the function'
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResult(results);
    
    toast({
      title: results.success ? "Great job!" : "Keep practicing!",
      description: `You scored ${results.score} points.`,
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
            <CustomText fontSize="2xl" fontWeight="bold" color="#ffd93d" mb={2}>
              ✏️ Code Completion Quiz
            </CustomText>
            <CustomText color="#ccc" mb={4}>
              Fill in the blanks to complete the code snippet.
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
            {sampleCodeWithBlanks.replace(/__BLANK_\d+__/g, '______')}
          </Box>
          
          <HStack spacing={4}>
            <Button
              bg="#ffd93d"
              color="#000"
              onClick={() => setShowQuiz(true)}
              _hover={{ bg: "#ffed4e" }}
            >
              Try This Quiz
            </Button>
          </HStack>
          
          <Box mt={2}>
            <HStack spacing={3}>
              <Badge bg="#333" color="#ccc">Fill in the Blanks</Badge>
              <Badge bg="#333" color="#ccc">TypeScript</Badge>
              <Badge bg="#333" color="#ccc">Logic</Badge>
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

export default CodeCompletionShowcase;