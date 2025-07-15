import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Progress
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import CodeStackingQuiz from './CodeStackingQuiz';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Popup Quiz Component that appears before proceeding to the next lesson
const QuizPopup = ({
  isOpen,
  onClose,
  onComplete,
  quizData,
  lessonTitle
}) => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuizCompleted(false);
      setQuizResults(null);
    }
  }, [isOpen]);
  
  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setQuizCompleted(true);
    
    // Show celebration effect for successful completion
    if (results.success) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 300);
    }
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (onComplete) {
      onComplete(quizResults);
    }
    onClose();
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay bg="rgba(0,0,0,0.8)" backdropFilter="blur(3px)" />
      <ModalContent
        bg="#111"
        border="1px solid #333"
        borderRadius="md"
        maxW="90vw"
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader bg="#000" borderBottom="1px solid #333">
          <HStack justify="space-between" w="100%">
            <VStack align="start" spacing={0}>
              <Text color="#00ff00" fontWeight="bold" fontSize="lg">
                Quiz Challenge
              </Text>
              <Text color="#ccc" fontSize="sm">
                {quizData?.title || `Test your knowledge: ${lessonTitle}`}
              </Text>
            </VStack>
            
            {quizCompleted && (
              <HStack>
                <Badge 
                  bg={quizResults?.success ? "green.600" : "yellow.600"} 
                  color="white"
                  p={1}
                >
                  {quizResults?.success ? "PASSED" : "TRY AGAIN"}
                </Badge>
              </HStack>
            )}
          </HStack>
        </ModalHeader>
        
        <ModalBody p={0} maxH="calc(90vh - 150px)" overflow="auto">
          {quizData?.type === 'code-stacking' && (
            <CodeStackingQuiz
              code={quizData.code}
              language={quizData.language || "csharp"}
              title={quizData.title}
              description={quizData.description}
              timeLimit={quizData.timeLimit}
              onComplete={handleQuizComplete}
              splitType={quizData.splitType || "line"}
              difficulty={quizData.difficulty || "medium"}
              juiciness={quizData.juiciness || "high"}
            />
          )}
          
          {/* Other quiz types can be added here */}
          
          {/* Results and Continue Button */}
          {quizCompleted && (
            <Box p={5} bg="#000" borderTop="1px solid #333">
              <HStack justify="space-between" w="100%">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text color="#ccc">Final Score:</Text>
                    <Text color="#ffd93d" fontWeight="bold">
                      {quizResults?.score || 0}
                    </Text>
                  </HStack>
                  <Progress 
                    value={quizResults?.correctPlacements / (quizData?.totalBlocks || 10) * 100 || 0} 
                    colorScheme="green" 
                    size="sm" 
                    w="200px" 
                  />
                </VStack>
                
                <Button
                  colorScheme={quizResults?.success ? "green" : "blue"}
                  onClick={handleContinue}
                  size="md"
                >
                  {quizResults?.success ? "Continue to Next Lesson" : "Try Again Later"}
                </Button>
              </HStack>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizPopup;