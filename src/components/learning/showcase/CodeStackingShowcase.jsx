import React, { useState } from 'react';
import { Box, VStack, Button, Text, HStack, Badge, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import QuizManager from '../QuizManager';

const MotionBox = motion(Box);

const CodeStackingShowcase = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const toast = useToast();

  // Sample code for the quiz
  const sampleCode = 
`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const cart = [
  { name: 'Book', price: 20 },
  { name: 'Pen', price: 5 }
];

const totalPrice = calculateTotal(cart);
console.log('Total:', totalPrice);`;

  // Quiz data configuration
  const quizData = {
    type: 'code-stacking',
    code: sampleCode,
    language: 'javascript',
    timeLimit: 120,
    difficulty: 'medium',
    title: 'Arrange the Code Blocks',
    description: 'Drag and drop the code blocks into the correct order to form a complete program',
    splitType: 'line'
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResult(results);
    
    toast({
      title: results.success ? "Great job!" : "Keep practicing!",
      description: `You scored ${results.score} points with ${results.correctPlacements} correct placements.`,
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
            <Text fontSize="2xl" fontWeight="bold" color="#4ecdc4" mb={2}>
              🧩 Code Stacking Quiz
            </Text>
            <Text color="#ccc" mb={4}>
              Arrange code blocks in the correct order to create a complete program.
            </Text>
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
            {sampleCode}
          </Box>
          
          <HStack spacing={4}>
            <Button
              bg="#4ecdc4"
              color="#000"
              onClick={() => setShowQuiz(true)}
              _hover={{ bg: "#5ed9d1" }}
            >
              Try This Quiz
            </Button>
          </HStack>
          
          <Box mt={2}>
            <HStack spacing={3}>
              <Badge bg="#333" color="#ccc">Interactive</Badge>
              <Badge bg="#333" color="#ccc">Drag & Drop</Badge>
              <Badge bg="#333" color="#ccc">JavaScript</Badge>
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

export default CodeStackingShowcase;