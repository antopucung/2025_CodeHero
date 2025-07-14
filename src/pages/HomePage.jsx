import React from 'react';
import { Box, Text, VStack, HStack, Button, Grid, GridItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';

const MotionBox = motion(Box);

const HomePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  const modes = [
    {
      id: 'editor',
      title: 'CODE EDITOR',
      description: 'Write and execute code with full IDE features',
      icon: '⌨️',
      color: '#4ecdc4',
      features: ['Monaco Editor', 'Multi-language Support', 'Real-time Execution', 'Syntax Highlighting'],
      path: '/editor'
    },
    {
      id: 'typing',
      title: 'TYPING CHALLENGE',
      description: 'Gamified typing with combos, achievements, and progression',
      icon: '🎯',
      color: '#ffd93d',
      features: ['Combo System', 'Visual Effects', 'Achievement Unlocks', 'Skill Progression'],
      path: '/typing'
    },
    {
      id: 'hybrid',
      title: 'HYBRID MODE',
      description: 'Type code challenges then execute for complete learning',
      icon: '🚀',
      color: '#ff6b6b',
      features: ['Type + Execute', 'Code Learning', 'Pattern Recognition', 'Skill Building'],
      path: '/hybrid'
    }
  ];

  return (
    <Box 
      h="100%" 
      p={6}
      overflow="auto"
      bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)"
    >
      <VStack spacing={8} maxW="1200px" mx="auto">
        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          textAlign="center"
        >
          <MotionBox
            animate={{
              textShadow: [
                "0 0 20px #00ff00",
                "0 0 40px #00ff00",
                "0 0 20px #00ff00"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Text fontSize="4xl" fontWeight="bold" color="#00ff00" mb={4}>
              Welcome to Terminal IDE
            </Text>
          </MotionBox>
          
          <Text fontSize="xl" color="#666" mb={6}>
            The Ultimate Gamified Coding & Typing Experience
          </Text>
          
          {/* Player Stats */}
          <HStack justify="center" spacing={8} mb={8}>
            <VStack spacing={0}>
              <Text fontSize="2xl" color="#ffd93d" fontWeight="bold">
                {progress.level}
              </Text>
              <Text fontSize="sm" color="#666">LEVEL</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="2xl" color="#4ecdc4" fontWeight="bold">
                {progress.bestWpm}
              </Text>
              <Text fontSize="sm" color="#666">BEST WPM</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="2xl" color="#ff6b6b" fontWeight="bold">
                {progress.totalChallengesCompleted}
              </Text>
              <Text fontSize="sm" color="#666">COMPLETED</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="2xl" color="#9c27b0" fontWeight="bold">
                {progress.achievements.length}
              </Text>
              <Text fontSize="sm" color="#666">ACHIEVEMENTS</Text>
            </VStack>
          </HStack>
        </MotionBox>

        {/* Mode Selection */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          w="100%"
        >
          <Text fontSize="2xl" fontWeight="bold" color="#00ff00" mb={6} textAlign="center">
            Choose Your Experience
          </Text>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            {modes.map((mode, index) => (
              <GridItem key={mode.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 0 30px ${mode.color}33`
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    bg="#111"
                    border={`2px solid ${mode.color}`}
                    borderRadius="8px"
                    p={6}
                    h="350px"
                    cursor="pointer"
                    onClick={() => navigate(mode.path)}
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      borderColor: mode.color,
                      bg: `${mode.color}11`
                    }}
                    transition="all 0.3s ease"
                  >
                    {/* Background Glow */}
                    <MotionBox
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg={`radial-gradient(circle at center, ${mode.color}22 0%, transparent 70%)`}
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    <VStack spacing={4} position="relative" zIndex={1}>
                      <Text fontSize="4xl">{mode.icon}</Text>
                      
                      <Text 
                        fontSize="xl" 
                        fontWeight="bold" 
                        color={mode.color}
                        textAlign="center"
                      >
                        {mode.title}
                      </Text>
                      
                      <Text 
                        fontSize="sm" 
                        color="#ccc" 
                        textAlign="center"
                        lineHeight="1.6"
                      >
                        {mode.description}
                      </Text>
                      
                      <VStack spacing={2} w="100%">
                        {mode.features.map((feature, idx) => (
                          <HStack key={idx} w="100%" justify="start">
                            <Text fontSize="xs" color={mode.color}>✓</Text>
                            <Text fontSize="xs" color="#999">{feature}</Text>
                          </HStack>
                        ))}
                      </VStack>
                      
                      <Button
                        bg={mode.color}
                        color="#000"
                        borderRadius="4px"
                        fontFamily="'Courier New', monospace"
                        fontSize="sm"
                        fontWeight="bold"
                        px={6}
                        py={2}
                        mt={4}
                        _hover={{ 
                          bg: mode.color,
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 20px ${mode.color}66`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(mode.path);
                        }}
                      >
                        START {mode.title}
                      </Button>
                    </VStack>
                  </Box>
                </MotionBox>
              </GridItem>
            ))}
          </Grid>
        </MotionBox>

        {/* Quick Stats */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          w="100%"
          bg="#111"
          border="1px solid #333"
          borderRadius="8px"
          p={6}
        >
          <Text fontSize="lg" fontWeight="bold" color="#00ff00" mb={4} textAlign="center">
            Your Progress Overview
          </Text>
          
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
            <VStack spacing={1}>
              <Text fontSize="lg" color="#ffd93d" fontWeight="bold">
                {progress.xp}
              </Text>
              <Text fontSize="xs" color="#666">TOTAL XP</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="lg" color="#4ecdc4" fontWeight="bold">
                {progress.bestAccuracy}%
              </Text>
              <Text fontSize="xs" color="#666">BEST ACCURACY</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="lg" color="#ff6b6b" fontWeight="bold">
                {Object.keys(progress.languageProgress).length}
              </Text>
              <Text fontSize="xs" color="#666">LANGUAGES</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="lg" color="#9c27b0" fontWeight="bold">
                {progress.dailyStreak}
              </Text>
              <Text fontSize="xs" color="#666">DAILY STREAK</Text>
            </VStack>
          </Grid>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default HomePage;