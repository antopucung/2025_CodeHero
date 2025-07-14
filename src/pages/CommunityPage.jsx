import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Grid, GridItem, Button, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useGameProgress } from '../hooks/useGameProgress';

const MotionBox = motion(Box);

const CommunityPage = () => {
  const { progress } = useGameProgress();
  const [projects] = useState([
    {
      id: 1,
      title: 'Space Invaders Unity Game',
      creator: 'CodeMaster99',
      description: 'A complete Space Invaders clone built with Unity and C#. Features power-ups, multiple levels, and particle effects.',
      language: 'csharp',
      thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 245,
      donations: 1250,
      tags: ['Unity', 'Game Dev', '2D'],
      difficulty: 'intermediate'
    },
    {
      id: 2,
      title: 'E-commerce React App',
      creator: 'WebWizard',
      description: 'Full-stack e-commerce platform with React frontend, Node.js backend, and Stripe integration.',
      language: 'javascript',
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 189,
      donations: 890,
      tags: ['React', 'Node.js', 'Full-Stack'],
      difficulty: 'advanced'
    },
    {
      id: 3,
      title: 'Python Data Visualizer',
      creator: 'DataNinja',
      description: 'Interactive data visualization tool using Python, Pandas, and Matplotlib. Perfect for analyzing CSV files.',
      language: 'python',
      thumbnail: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 156,
      donations: 675,
      tags: ['Python', 'Data Science', 'Visualization'],
      difficulty: 'beginner'
    }
  ]);

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      csharp: '🔵',
      php: '🐘'
    };
    return icons[language] || '💻';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#38A169',
      intermediate: '#D69E2E',
      advanced: '#E53E3E'
    };
    return colors[difficulty] || '#4A5568';
  };

  return (
    <Box w="100%" h="100%" overflow="hidden" display="flex" flexDirection="column" bg="#000">
      {/* Page Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        borderBottom="1px solid #333"
        p={6}
        flexShrink={0}
      >
        <VStack spacing={4} maxW="1200px" mx="auto">
          <MotionBox
            animate={{
              textShadow: [
                "0 0 20px #ff6b6b",
                "0 0 40px #ff6b6b",
                "0 0 20px #ff6b6b"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            textAlign="center"
          >
            <Text fontSize="3xl" fontWeight="bold" color="#ff6b6b" mb={2}>
              🎨 Community Gallery
            </Text>
            <Text fontSize="lg" color="#666">
              Showcase Your Creations & Support Fellow Developers
            </Text>
          </MotionBox>

          {/* Community Stats */}
          <HStack spacing={6} justify="center">
            <VStack spacing={0}>
              <Text fontSize="xl" color="#ffd93d" fontWeight="bold">
                {projects.length}
              </Text>
              <Text fontSize="xs" color="#666">PROJECTS</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" color="#4ecdc4" fontWeight="bold">
                {projects.reduce((sum, p) => sum + p.likes, 0)}
              </Text>
              <Text fontSize="xs" color="#666">TOTAL LIKES</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" color="#9c27b0" fontWeight="bold">
                ${projects.reduce((sum, p) => sum + p.donations, 0).toLocaleString()}
              </Text>
              <Text fontSize="xs" color="#666">DONATED</Text>
            </VStack>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Projects Grid */}
      <Box flex={1} overflow="auto" p={6} bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)">
        <VStack spacing={6} maxW="1200px" mx="auto">
          {/* Featured Projects Section */}
          <HStack justify="space-between" w="100%">
            <Text fontSize="xl" color="#ff6b6b" fontWeight="bold">
              Featured Community Projects
            </Text>
            <Button
              bg="#ff6b6b"
              color="#fff"
              size="sm"
              fontFamily="'Courier New', monospace"
              _hover={{ bg: "#ff8e8e" }}
            >
              + Submit Project
            </Button>
          </HStack>

          <Grid 
            templateColumns={{ 
              base: "1fr", 
              md: "repeat(2, 1fr)", 
              lg: "repeat(3, 1fr)" 
            }} 
            gap={6}
            w="100%"
          >
            {projects.map((project, index) => (
              <GridItem key={project.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 25px #ff6b6b33"
                  }}
                  whileTap={{ scale: 0.98 }}
                  bg="#111"
                  border="1px solid #333"
                  borderRadius="8px"
                  overflow="hidden"
                  cursor="pointer"
                  _hover={{
                    borderColor: "#ff6b6b"
                  }}
                  transition="all 0.3s ease"
                  h="100%"
                  display="flex"
                  flexDirection="column"
                >
                  {/* Project Thumbnail */}
                  <Box position="relative" h="200px" overflow="hidden">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      top="10px"
                      left="10px"
                      display="flex"
                      gap={2}
                    >
                      <Badge bg={getDifficultyColor(project.difficulty)} color="white" fontSize="xs">
                        {project.difficulty.toUpperCase()}
                      </Badge>
                      <Badge bg="#333" color="white" fontSize="xs">
                        {getLanguageIcon(project.language)} {project.language.toUpperCase()}
                      </Badge>
                    </Box>
                  </Box>

                  {/* Project Content */}
                  <VStack p={4} align="stretch" spacing={3} flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="#ff6b6b"
                      noOfLines={2}
                      minH="48px"
                    >
                      {project.title}
                    </Text>

                    <HStack spacing={2}>
                      <Text fontSize="sm" color="#ffd93d" fontWeight="bold">
                        by {project.creator}
                      </Text>
                    </HStack>

                    <Text
                      fontSize="sm"
                      color="#ccc"
                      noOfLines={3}
                      flex={1}
                    >
                      {project.description}
                    </Text>

                    {/* Tags */}
                    <HStack spacing={1} flexWrap="wrap">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} bg="#333" color="#ccc" fontSize="xs">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>

                    {/* Project Stats */}
                    <HStack justify="space-between" fontSize="sm">
                      <HStack spacing={3}>
                        <HStack spacing={1}>
                          <Text color="#ff6b6b">❤️</Text>
                          <Text color="#ccc">{project.likes}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Text color="#ffd93d">💰</Text>
                          <Text color="#ccc">${project.donations}</Text>
                        </HStack>
                      </HStack>
                    </HStack>

                    {/* Action Buttons */}
                    <HStack spacing={2}>
                      <Button
                        bg="#333"
                        color="#ccc"
                        size="sm"
                        flex={1}
                        fontFamily="'Courier New', monospace"
                        fontSize="xs"
                        _hover={{ bg: "#444" }}
                      >
                        👀 View
                      </Button>
                      <Button
                        bg="#ffd93d"
                        color="#000"
                        size="sm"
                        flex={1}
                        fontFamily="'Courier New', monospace"
                        fontSize="xs"
                        _hover={{ bg: "#ffed4e" }}
                      >
                        💝 Donate
                      </Button>
                    </HStack>
                  </VStack>
                </MotionBox>
              </GridItem>
            ))}
          </Grid>

          {/* Call to Action */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            w="100%"
            textAlign="center"
          >
            <Text fontSize="lg" color="#ff6b6b" fontWeight="bold" mb={2}>
              🚀 Ready to Showcase Your Work?
            </Text>
            <Text fontSize="sm" color="#666" mb={4}>
              Share your projects with the community and get support for your next big idea!
            </Text>
            <Button
              bg="#ff6b6b"
              color="#fff"
              fontFamily="'Courier New', monospace"
              _hover={{ bg: "#ff8e8e" }}
            >
              📤 Submit Your Project
            </Button>
          </MotionBox>
        </VStack>
      </Box>
    </Box>
  );
};

export default CommunityPage;