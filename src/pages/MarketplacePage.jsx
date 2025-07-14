import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Grid, GridItem, Button, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';

const MotionBox = motion(Box);

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample courses data - will be replaced with Supabase data
  const sampleCourses = [
    {
      id: 'unity-csharp-101',
      title: 'Unity C# Scripting 101',
      description: 'Learn C# programming fundamentals for Unity game development. Master variables, functions, and game object interactions.',
      language: 'csharp',
      difficulty: 'beginner',
      price: 49.99,
      thumbnail_url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'GameDev Master',
      lessons_count: 25,
      duration: '8 hours',
      rating: 4.8,
      students: 1250
    },
    {
      id: 'python-basics',
      title: 'Python Programming Fundamentals',
      description: 'Start your coding journey with Python. Learn syntax, data structures, and build real projects step by step.',
      language: 'python',
      difficulty: 'beginner',
      price: 39.99,
      thumbnail_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Code Ninja',
      lessons_count: 30,
      duration: '12 hours',
      rating: 4.9,
      students: 2340
    },
    {
      id: 'javascript-advanced',
      title: 'Advanced JavaScript Patterns',
      description: 'Master advanced JavaScript concepts including async/await, closures, prototypes, and modern ES6+ features.',
      language: 'javascript',
      difficulty: 'advanced',
      price: 79.99,
      thumbnail_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'JS Expert',
      lessons_count: 35,
      duration: '15 hours',
      rating: 4.7,
      students: 890
    },
    {
      id: 'java-spring-boot',
      title: 'Java Spring Boot Development',
      description: 'Build enterprise-grade applications with Spring Boot. Learn REST APIs, database integration, and deployment.',
      language: 'java',
      difficulty: 'intermediate',
      price: 69.99,
      thumbnail_url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Enterprise Dev',
      lessons_count: 40,
      duration: '20 hours',
      rating: 4.6,
      students: 1560
    },
    {
      id: 'react-typescript',
      title: 'React with TypeScript Mastery',
      description: 'Build type-safe React applications. Learn hooks, context, state management, and modern development practices.',
      language: 'typescript',
      difficulty: 'intermediate',
      price: 59.99,
      thumbnail_url: 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Frontend Pro',
      lessons_count: 28,
      duration: '14 hours',
      rating: 4.8,
      students: 2100
    },
    {
      id: 'php-laravel',
      title: 'PHP Laravel Web Development',
      description: 'Create powerful web applications with Laravel. Learn MVC architecture, authentication, and API development.',
      language: 'php',
      difficulty: 'intermediate',
      price: 54.99,
      thumbnail_url: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructor: 'Web Architect',
      lessons_count: 32,
      duration: '16 hours',
      rating: 4.5,
      students: 980
    }
  ];

  useEffect(() => {
    // Simulate loading - will be replaced with Supabase fetch
    setTimeout(() => {
      setCourses(sampleCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#38A169',
      intermediate: '#D69E2E',
      advanced: '#E53E3E'
    };
    return colors[difficulty] || '#4A5568';
  };

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

  const handleCourseClick = (courseId) => {
    navigate(`/modules/${courseId}`);
  };

  if (loading) {
    return (
      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="#000">
        <VStack spacing={4}>
          <MotionBox
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            color="#00ff00"
            fontSize="3xl"
          >
            ⚡
          </MotionBox>
          <Text color="#00ff00" fontFamily="'Courier New', monospace">
            Loading Marketplace...
          </Text>
        </VStack>
      </Box>
    );
  }

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
                "0 0 20px #00ff00",
                "0 0 40px #00ff00",
                "0 0 20px #00ff00"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            textAlign="center"
          >
            <Text fontSize="3xl" fontWeight="bold" color="#00ff00" mb={2}>
              🛒 Learning Marketplace
            </Text>
            <Text fontSize="lg" color="#666">
              Gamified Interactive Programming Courses
            </Text>
          </MotionBox>

          {/* Player Stats */}
          <HStack spacing={6} justify="center">
            <VStack spacing={0}>
              <Text fontSize="xl" color="#ffd93d" fontWeight="bold">
                {progress.level}
              </Text>
              <Text fontSize="xs" color="#666">LEVEL</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" color="#4ecdc4" fontWeight="bold">
                {progress.totalChallengesCompleted}
              </Text>
              <Text fontSize="xs" color="#666">COMPLETED</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" color="#ff6b6b" fontWeight="bold">
                {progress.achievements.length}
              </Text>
              <Text fontSize="xs" color="#666">ACHIEVEMENTS</Text>
            </VStack>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Courses Grid */}
      <Box flex={1} overflow="auto" p={6} bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)">
        <VStack spacing={6} maxW="1200px" mx="auto">
          <HStack justify="space-between" w="100%">
            <Text fontSize="xl" color="#00ff00" fontWeight="bold">
              Featured Courses
            </Text>
            <Text fontSize="sm" color="#666">
              {courses.length} courses available
            </Text>
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
            {courses.map((course, index) => (
              <GridItem key={course.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 25px #00ff0033"
                  }}
                  whileTap={{ scale: 0.98 }}
                  bg="#111"
                  border="1px solid #333"
                  borderRadius="8px"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => handleCourseClick(course.id)}
                  _hover={{
                    borderColor: "#00ff00"
                  }}
                  transition="all 0.3s ease"
                  h="100%"
                  display="flex"
                  flexDirection="column"
                >
                  {/* Course Thumbnail */}
                  <Box position="relative" h="200px" overflow="hidden">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
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
                      <Badge bg={getDifficultyColor(course.difficulty)} color="white" fontSize="xs">
                        {course.difficulty.toUpperCase()}
                      </Badge>
                      <Badge bg="#333" color="white" fontSize="xs">
                        {getLanguageIcon(course.language)} {course.language.toUpperCase()}
                      </Badge>
                    </Box>
                    <Box
                      position="absolute"
                      top="10px"
                      right="10px"
                      bg="rgba(0,0,0,0.8)"
                      color="#ffd93d"
                      px={2}
                      py={1}
                      borderRadius="4px"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      ${course.price}
                    </Box>
                  </Box>

                  {/* Course Content */}
                  <VStack p={4} align="stretch" spacing={3} flex={1}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="#00ff00"
                      noOfLines={2}
                      minH="48px"
                    >
                      {course.title}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="#ccc"
                      noOfLines={3}
                      flex={1}
                    >
                      {course.description}
                    </Text>

                    {/* Course Stats */}
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between" fontSize="xs" color="#666">
                        <Text>👨‍🏫 {course.instructor}</Text>
                        <Text>⭐ {course.rating}</Text>
                      </HStack>
                      
                      <HStack justify="space-between" fontSize="xs" color="#666">
                        <Text>📚 {course.lessons_count} lessons</Text>
                        <Text>⏱️ {course.duration}</Text>
                      </HStack>
                      
                      <HStack justify="space-between" fontSize="xs" color="#666">
                        <Text>👥 {course.students.toLocaleString()} students</Text>
                        <Text>🎯 Interactive</Text>
                      </HStack>
                    </VStack>

                    {/* Action Button */}
                    <Button
                      bg="#00ff00"
                      color="#000"
                      fontFamily="'Courier New', monospace"
                      fontSize="sm"
                      fontWeight="bold"
                      borderRadius="4px"
                      _hover={{ 
                        bg: "#00cc00",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 15px #00ff0066"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}
                    >
                      🚀 VIEW COURSE
                    </Button>
                  </VStack>
                </MotionBox>
              </GridItem>
            ))}
          </Grid>

          {/* Coming Soon Section */}
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
            <Text fontSize="lg" color="#ffd93d" fontWeight="bold" mb={2}>
              🚀 More Courses Coming Soon!
            </Text>
            <Text fontSize="sm" color="#666">
              Advanced React, Node.js, Machine Learning, Game Development, and more...
            </Text>
          </MotionBox>
        </VStack>
      </Box>
    </Box>
  );
};

export default MarketplacePage;