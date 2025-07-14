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
      description: 'Professional IDE with execution',
      icon: '⌨️',
      color: '#4ecdc4',
      path: '/editor'
    },
    {
      id: 'typing',
      title: 'TYPING CHALLENGE',
      description: 'Gamified typing with combos',
      icon: '🎯',
      color: '#ffd93d',
      path: '/typing'
    },
    {
      id: 'hybrid',
      title: 'HYBRID MODE',
      description: 'Type code then execute',
      icon: '🚀',
      color: '#ff6b6b',
      path: '/hybrid'
    }
  ];

  return (
    <Box 
      w="100%"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)"
    >
      {/* Content Container - Scrollable if needed */}
      <Box
        flex={1}
        overflow="auto"
        p={{ base: 4, md: 6 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <VStack spacing={{ base: 4, md: 6 }} maxW="1000px" w="100%">
          {/* Welcome Section - Compact */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            w="100%"
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
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#00ff00" mb={2}>
                Terminal IDE
              </Text>
            </MotionBox>
            
            <Text fontSize={{ base: "md", md: "lg" }} color="#666" mb={4}>
              Gamified Coding & Typing Experience
            </Text>
            
            {/* Player Stats - Compact */}
            <HStack justify="center" spacing={{ base: 4, md: 6 }} mb={4}>
              <VStack spacing={0}>
                <Text fontSize={{ base: "lg", md: "xl" }} color="#ffd93d" fontWeight="bold">
                  {progress.level}
                </Text>
                <Text fontSize="xs" color="#666">LEVEL</Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize={{ base: "lg", md: "xl" }} color="#4ecdc4" fontWeight="bold">
                  {progress.bestWpm}
                </Text>
                <Text fontSize="xs" color="#666">WPM</Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize={{ base: "lg", md: "xl" }} color="#ff6b6b" fontWeight="bold">
                  {progress.totalChallengesCompleted}
                </Text>
                <Text fontSize="xs" color="#666">DONE</Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize={{ base: "lg", md: "xl" }} color="#9c27b0" fontWeight="bold">
                  {progress.achievements.length}
                </Text>
                <Text fontSize="xs" color="#666">AWARDS</Text>
              </VStack>
            </HStack>
          </MotionBox>

          {/* Mode Selection - Responsive Grid */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            w="100%"
            flex={1}
          >
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="#00ff00" mb={4} textAlign="center">
              Choose Your Mode
            </Text>
            
            <Grid 
              templateColumns={{ 
                base: "1fr", 
                md: "repeat(2, 1fr)", 
                lg: "repeat(3, 1fr)" 
              }} 
              gap={{ base: 3, md: 4 }}
              h={{ base: "auto", lg: "300px" }}
            >
              {modes.map((mode, index) => (
                <GridItem key={mode.id}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 0 20px ${mode.color}33`
                    }}
                    whileTap={{ scale: 0.98 }}
                    h="100%"
                  >
                    <Box
                      bg="#111"
                      border={`2px solid ${mode.color}`}
                      borderRadius="8px"
                      p={{ base: 4, md: 5 }}
                      h="100%"
                      cursor="pointer"
                      onClick={() => navigate(mode.path)}
                      position="relative"
                      overflow="hidden"
                      _hover={{
                        borderColor: mode.color,
                        bg: `${mode.color}11`
                      }}
                      transition="all 0.3s ease"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      minH={{ base: "180px", md: "220px" }}
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
                      
                      <VStack spacing={3} position="relative" zIndex={1} flex={1} justify="center">
                        <Text fontSize={{ base: "3xl", md: "4xl" }}>{mode.icon}</Text>
                        
                        <Text 
                          fontSize={{ base: "md", md: "lg" }} 
                          fontWeight="bold" 
                          color={mode.color}
                          textAlign="center"
                        >
                          {mode.title}
                        </Text>
                        
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color="#ccc" 
                          textAlign="center"
                          lineHeight="1.4"
                        >
                          {mode.description}
                        </Text>
                        
                        <Button
                          bg={mode.color}
                          color="#000"
                          borderRadius="4px"
                          fontFamily="'Courier New', monospace"
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="bold"
                          px={4}
                          py={2}
                          mt={2}
                          _hover={{ 
                            bg: mode.color,
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 15px ${mode.color}66`
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(mode.path);
                          }}
                        >
                          START
                        </Button>
                      </VStack>
                    </Box>
                  </MotionBox>
                </GridItem>
              ))}
            </Grid>
          </MotionBox>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;