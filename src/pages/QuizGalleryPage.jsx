import React, { useState } from 'react';
import { Box, Grid, VStack, HStack, Heading, Text, Badge, Container, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { useGameProgress } from '../hooks/useGameProgress';
import QuizGalleryCard from '../components/learning/gallery/QuizGalleryCard';
import CodeStackingShowcase from '../components/learning/showcase/CodeStackingShowcase';
import CodeCompletionShowcase from '../components/learning/showcase/CodeCompletionShowcase';
import DebugChallengeShowcase from '../components/learning/showcase/DebugChallengeShowcase';
import MultipleChoiceShowcase from '../components/learning/showcase/MultipleChoiceShowcase';
import DinoRunQuizShowcase from '../components/learning/showcase/DinoRunQuizShowcase';

const MotionBox = motion(Box);

const QuizGalleryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeShowcase, setActiveShowcase] = useState(null);
  const { progress } = useGameProgress();
  
  // Stats for header
  const stats = [
    { value: '5+', label: 'QUIZ TYPES' },
    { value: 'Interactive', label: 'LEARNING' },
    { value: 'Gamified', label: 'EXPERIENCE' }
  ];
  
  // Quiz types for the gallery
  const quizTypes = [
    {
      id: 'code-stacking',
      title: 'Code Stacking',
      description: 'Arrange code blocks in the correct order to form a complete program.',
      icon: '🧩',
      color: '#4ecdc4',
      difficulty: 'medium',
      component: CodeStackingShowcase
    },
    {
      id: 'code-completion',
      title: 'Code Completion',
      description: 'Fill in the blanks to complete the code snippet.',
      icon: '✏️',
      color: '#ffd93d',
      difficulty: 'medium',
      component: CodeCompletionShowcase
    },
    {
      id: 'debug-challenge',
      title: 'Debug Challenge',
      description: 'Identify and fix bugs in the given code.',
      icon: '🔍',
      color: '#ff6b6b',
      difficulty: 'hard',
      component: DebugChallengeShowcase
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Choose the correct answer from multiple options.',
      icon: '🎯',
      color: '#6bcf7f',
      difficulty: 'easy',
      component: MultipleChoiceShowcase
    },
    {
      id: 'dino-run',
      title: 'Dino Run Quiz',
      description: 'Jump to collect correct answers while avoiding obstacles.',
      icon: '🦖',
      color: '#a374db',
      difficulty: 'medium',
      component: DinoRunQuizShowcase,
      comingSoon: true
    }
  ];

  return (
    <PageLayout background="primary">
      <PageHeader
        title="🎮 Quiz Engine Gallery"
        subtitle="Interactive & Gamified Learning Components"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        {activeShowcase ? (
          <VStack spacing={4} w="100%">
            <HStack alignSelf="flex-start">
              <Badge 
                as="button"
                onClick={() => setActiveShowcase(null)}
                bg="#222"
                color="#ccc"
                px={3}
                py={2}
                borderRadius="md"
                _hover={{ bg: "#333" }}
              >
                ← Back to Gallery
              </Badge>
              <Badge bg={activeShowcase.color} color="#000">
                {activeShowcase.icon} {activeShowcase.title}
              </Badge>
            </HStack>
            
            <Box w="100%" minH="500px">
              <activeShowcase.component />
            </Box>
          </VStack>
        ) : (
          <VStack spacing={6} w="100%">
            <Tabs 
              variant="soft-rounded" 
              colorScheme="teal" 
              w="100%"
              onChange={setActiveTab}
              index={activeTab}
            >
              <TabList>
                <Tab>All Quizzes</Tab>
                <Tab>Easy</Tab>
                <Tab>Medium</Tab>
                <Tab>Hard</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel px={0}>
                  <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={6}
                  >
                    {quizTypes.map((quizType) => (
                      <QuizGalleryCard 
                        key={quizType.id}
                        quiz={quizType}
                        onClick={() => setActiveShowcase(quizType)}
                      />
                    ))}
                  </Grid>
                </TabPanel>
                
                <TabPanel px={0}>
                  <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={6}
                  >
                    {quizTypes
                      .filter(quiz => quiz.difficulty === 'easy')
                      .map((quizType) => (
                        <QuizGalleryCard 
                          key={quizType.id}
                          quiz={quizType}
                          onClick={() => setActiveShowcase(quizType)}
                        />
                      ))}
                  </Grid>
                </TabPanel>
                
                <TabPanel px={0}>
                  <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={6}
                  >
                    {quizTypes
                      .filter(quiz => quiz.difficulty === 'medium')
                      .map((quizType) => (
                        <QuizGalleryCard 
                          key={quizType.id}
                          quiz={quizType}
                          onClick={() => setActiveShowcase(quizType)}
                        />
                      ))}
                  </Grid>
                </TabPanel>
                
                <TabPanel px={0}>
                  <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={6}
                  >
                    {quizTypes
                      .filter(quiz => quiz.difficulty === 'hard')
                      .map((quizType) => (
                        <QuizGalleryCard 
                          key={quizType.id}
                          quiz={quizType}
                          onClick={() => setActiveShowcase(quizType)}
                        />
                      ))}
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            <Box 
              bg="#111" 
              p={6} 
              borderRadius="md" 
              border="1px solid #333"
              w="100%"
            >
              <VStack spacing={3} align="start">
                <Heading size="md" color="#00ff00">Implementation Documentation</Heading>
                <Text color="#ccc">
                  Our quiz engine provides a flexible, reusable system for creating interactive learning experiences.
                  Each quiz type is built on a shared foundation, making it easy to implement across your application.
                </Text>
                <Box as="pre" p={4} bg="#000" borderRadius="md" w="100%" overflowX="auto">
                  <Text color="#4ecdc4" fontSize="sm" fontFamily="monospace">
{`import { QuizManager } from '../components/learning/QuizManager';

// Define your quiz data
const quizData = {
  type: 'code-stacking',
  code: 'function example() {\n  console.log("Hello");\n  return true;\n}',
  language: 'javascript',
  timeLimit: 120,
  difficulty: 'medium'
};

// Render the quiz component
return <QuizManager quizData={quizData} onComplete={handleComplete} />;`}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        )}
      </SectionLayout>
    </PageLayout>
  );
};

export default QuizGalleryPage;