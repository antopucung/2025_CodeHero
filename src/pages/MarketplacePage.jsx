import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Grid, GridItem, Button, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';

const MotionBox = motion(Box);

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const { getEnrolledCourses } = useUserEnrollment();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const enrolled = await getEnrolledCourses();
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

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
            
            {/* Enrolled Courses Quick Access */}
            {enrolledCourses.length > 0 && (
              <VStack spacing={2}>
                <Text fontSize="sm" color="#4ecdc4" fontWeight="bold">
                  📚 My Courses ({enrolledCourses.length})
                </Text>
                <HStack spacing={2} flexWrap="wrap" justify="center">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <Button
                      key={course.id}
                      size="xs"
                      bg="#333"
                      color="#4ecdc4"
                      onClick={() => navigate(`/modules/${course.id}`)}
                      fontFamily="'Courier New', monospace"
                      _hover={{ bg: "#444" }}
                    >
                      {course.title.split(' ').slice(0, 2).join(' ')}
                    </Button>
                  ))}
                  {enrolledCourses.length > 3 && (
                    <Text fontSize="xs" color="#666">+{enrolledCourses.length - 3} more</Text>
                  )}
                </HStack>
              </VStack>
            )}
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
                  onClick={() => handleCourseClick(course.slug)}
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
                        <Text>👨‍🏫 {course.instructor_name}</Text>
                        <Text>⭐ {course.rating}</Text>
                      </HStack>
                      
                      <HStack justify="space-between" fontSize="xs" color="#666">
                        <Text>📚 {course.lessons_count} lessons</Text>
                        <Text>⏱️ {course.duration_hours}h</Text>
                      </HStack>
                      
                      <HStack justify="space-between" fontSize="xs" color="#666">
                        <Text>👥 {course.students_count?.toLocaleString()} students</Text>
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
                        handleCourseClick(course.slug);
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