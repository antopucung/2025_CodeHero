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
  Progress,
  IconButton
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import CodeStackingQuiz from './CodeStackingQuiz';
import { useEffect } from 'react';
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
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuizCompleted(false);
      setQuizResults(null);
      setShowCloseWarning(false);
    }
  }, [isOpen]);
  
  // Handle modal close attempt
  const handleCloseAttempt = () => {
    if (!quizCompleted) {
      setShowCloseWarning(true);
      setTimeout(() => setShowCloseWarning(false), 3000);
      return;
    }
    onClose();
  };
  
  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setQuizCompleted(true);
    
    // Show celebration effect for successful completion
    if (results.success) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Add a second burst for more excitement
        setTimeout(() => {
          confetti({
            particleCount: 75,
            spread: 50,
            origin: { x: 0.2, y: 0.7 }
          });
          
          confetti({
            particleCount: 75,
            spread: 50,
            origin: { x: 0.8, y: 0.7 }
          });
        }, 500);
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
      onClose={handleCloseAttempt}
      size="5xl"
      closeOnOverlayClick={quizCompleted}
      isCentered
    >
      <ModalOverlay 
        bg="rgba(0,0,0,0.8)" 
        backdropFilter="blur(3px)"
        onClick={(e) => {
          if (!quizCompleted) {
            e.stopPropagation();
            setShowCloseWarning(true);
            setTimeout(() => setShowCloseWarning(false), 3000);
          }
        }}
      />
      <ModalContent
        bg={quizCompleted ? "#001100" : "#111"}
        border="1px solid #333"
        borderRadius="md"
        maxW="90vw"
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader bg="#000" borderBottom="1px solid #333">
          <HStack 
            justify="space-between" 
            w="100%" 
            position="relative"
            className={showCloseWarning ? "shake-animation" : ""}
          >
            <VStack align="start" spacing={0}>
              <Text 
                color={quizCompleted ? "#00ff00" : "#ffd93d"} 
                fontWeight="bold" 
                fontSize="lg"
              >
                {quizCompleted ? "Quiz Completed!" : "Quiz Challenge"}
              </Text>
              <Text color="#ccc" fontSize="sm">
                {quizData?.title || `Test your knowledge: ${lessonTitle}`}
              </Text>
            </VStack>
            
            {/* Warning message when trying to close */}
            {showCloseWarning && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                position="absolute"
                top="100%"
                left="0"
                bg="#ff6b6b"
                color="#000"
                px={3}
                py={1}
                borderRadius="md"
                zIndex={10}
                fontSize="xs"
                fontWeight="bold"
              >
                Complete the quiz to proceed to the next lesson!
              </MotionBox>
            )}
            
            {quizCompleted && (
              <HStack spacing={4}>
                <MotionBox
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 1, -1, 0],
                    boxShadow: [
                      "0 0 5px #00ff00", 
                      "0 0 15px #00ff00", 
                      "0 0 5px #00ff00"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <Badge 
                    bg={quizResults?.success ? "green.600" : "yellow.600"} 
                    color="white"
                    p={2}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {quizResults?.success ? "QUEST COMPLETE" : "TRY AGAIN"}
                  </Badge>
                </MotionBox>
              </HStack>
            )}
          </HStack>
          
          {/* Close button with warning */}
          <ModalCloseButton 
            color="#ccc"
            onClick={(e) => {
              if (!quizCompleted) {
                e.preventDefault();
                setShowCloseWarning(true);
                setTimeout(() => setShowCloseWarning(false), 3000);
              }
            }}
          />
        </ModalHeader>
        
        <ModalBody 
          p={0} 
          maxH="calc(90vh - 150px)" 
          overflow="auto"
          bg={quizCompleted && quizResults?.success ? 
            "linear-gradient(180deg, rgba(0,17,0,1) 0%, rgba(0,34,0,1) 100%)" : 
            "linear-gradient(180deg, rgba(17,17,17,1) 0%, rgba(0,0,0,1) 100%)"
          }
        >
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
            <MotionBox 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              p={5} 
              bg={quizResults?.success ? "#001800" : "#180000"} 
              borderTop={`1px solid ${quizResults?.success ? "#00ff00" : "#ff6b6b"}30`}
            >
              <HStack justify="space-between" w="100%">
                <VStack align="start" spacing={3} flex="1">
                  <HStack spacing={4} width="100%">
                    <VStack align="start" spacing={1}>
                      <Text color="#ccc" fontSize="xs">Final Score:</Text>
                      <Text color="#ffd93d" fontWeight="bold" fontSize="xl">
                        {quizResults?.score || 0}
                      </Text>
                    </VStack>
                    
                    <VStack align="start" spacing={1}>
                      <Text color="#ccc" fontSize="xs">Max Combo:</Text>
                      <Text color="#ff6b6b" fontWeight="bold">
                        x{quizResults?.maxCombo?.toFixed(1) || "1.0"}
                      </Text>
                    </VStack>
                    
                    <VStack align="start" spacing={1}>
                      <Text color="#ccc" fontSize="xs">Accuracy:</Text>
                      <Text 
                        color={quizResults?.correctPlacements / (quizData?.totalBlocks || 10) >= 0.8 ? "#00ff00" : "#ffd93d"} 
                        fontWeight="bold"
                      >
                        {Math.round(quizResults?.correctPlacements / (quizData?.totalBlocks || 10) * 100) || 0}%
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <Progress 
                    value={quizResults?.correctPlacements / (quizData?.totalBlocks || 10) * 100 || 0} 
                    colorScheme={quizResults?.success ? "green" : "yellow"}
                    size="sm" 
                    w="100%" 
                    borderRadius="full"
                    bg="#111"
                  />
                  
                  {quizResults?.success && (
                    <Text color="#00ff00" fontSize="xs">
                      Great job! You've demonstrated your understanding of this concept.
                    </Text>
                  )}
                  
                  {!quizResults?.success && (
                    <Text color="#ff9f43" fontSize="xs">
                      Keep practicing! You'll get it with a bit more effort.
                    </Text>
                  )}
                </VStack>
                
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                  bg={quizResults?.success ? "#00ff00" : "#3182CE"}
                  color={quizResults?.success ? "#000" : "#fff"}
                  onClick={handleContinue}
                  size="lg"
                  px={8}
                  fontWeight="bold"
                  boxShadow={quizResults?.success ? "0 0 15px #00ff0066" : "0 0 15px #3182CE66"}
                  _hover={{
                    bg: quizResults?.success ? "#00cc00" : "#2C5282",
                    boxShadow: quizResults?.success ? "0 0 20px #00ff0066" : "0 0 20px #3182CE66"
                  }}
                >
                  {quizResults?.success ? "Continue to Next Lesson →" : "Try Again Later"}
                  </Button>
                </MotionBox>
              </HStack>
            </MotionBox>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizPopup;

<style jsx="true">{`
  .shake-animation {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
    40%, 60% { transform: translate3d(3px, 0, 0); }
  }
`}</style>