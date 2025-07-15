import React, { useState } from 'react';
import { Box, VStack, Button, HStack, Badge, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import QuizManager from '../QuizManager';
import { CustomText } from '../../../design/components/Typography';

const MotionBox = motion(Box);

const MultipleChoiceShowcase = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const toast = useToast();

  // Quiz data configuration
  const quizData = {
    type: 'multiple-choice',
    questions: [
      {
        question: "What is the correct way to declare a constant in JavaScript?",
        answers: [
          "const x = 10;",
          "let x = 10;",
          "var x = 10;",
          "constant x = 10;"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "Which of these is NOT a JavaScript data type?",
        answers: [
          "String",
          "Boolean",
          "Float",
          "Symbol"
        ],
        correctAnswerIndex: 2,
        code: "// JavaScript primitive data types\n// typeof 'hello' => 'string'\n// typeof true => 'boolean'\n// typeof 42 => 'number'\n// typeof Symbol() => 'symbol'"
      },
      {
        question: "What will the following code output?\n\nconsole.log(2 + '2');",
        answers: [
          "4",
          "22",
          "TypeError",
          "NaN"
        ],
        correctAnswerIndex: 1
      }
    ],
    language: 'javascript',
    timeLimit: 90,
    difficulty: 'easy',
    title: 'JavaScript Quiz',
    description: 'Test your JavaScript knowledge with these multiple choice questions'
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResult(results);
    
    toast({
      title: results.success ? "Quiz completed!" : "Try again!",
      description: `You answered ${results.correctAnswers} out of ${quizData.questions.length} correctly and scored ${results.score} points.`,
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
            <CustomText fontSize="2xl" fontWeight="bold" color="#6bcf7f" mb={2}>
              🎯 Multiple Choice Quiz
            </CustomText>
            <CustomText color="#ccc" mb={4}>
              Test your knowledge with interactive multiple-choice questions.
            </CustomText>
          </MotionBox>
          
          <VStack spacing={3} p={4} bg="#000" borderRadius="md" w="100%">
            <CustomText color="#6bcf7f" fontWeight="bold">Sample Questions:</CustomText>
            <Box p={3} bg="#111" borderRadius="md" w="100%">
              <CustomText color="#ccc">What is the correct way to declare a constant in JavaScript?</CustomText>
            </Box>
            <Box p={3} bg="#111" borderRadius="md" w="100%">
              <CustomText color="#ccc">Which of these is NOT a JavaScript data type?</CustomText>
            </Box>
          </VStack>
          
          <HStack spacing={4}>
            <Button
              bg="#6bcf7f"
              color="#000"
              onClick={() => setShowQuiz(true)}
              _hover={{ bg: "#7dd87f" }}
            >
              Try This Quiz
            </Button>
          </HStack>
          
          <Box mt={2}>
            <HStack spacing={3}>
              <Badge bg="#333" color="#ccc">Multiple Choice</Badge>
              <Badge bg="#333" color="#ccc">JavaScript</Badge>
              <Badge bg="#333" color="#ccc">Beginner</Badge>
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

export default MultipleChoiceShowcase;