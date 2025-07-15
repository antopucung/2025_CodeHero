import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text as ChakraText, VStack, HStack, Button, Grid, GridItem, Badge, Image, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { supabase } from '../lib/supabase';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

const ModuleDetailPage = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollSuccess, setShowEnrollSuccess] = useState(false);
  
  const { isEnrolled, enrollInCourse, getCourseProgress, getCompletionPercentage } = useUserEnrollment();
  const enrolled = course ? isEnrolled(course.id) : false;
  const progress = course ? getCourseProgress(course.id) : { completedLessons: [], currentLesson: null };

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (courseError) throw courseError;
      
      // Fetch lessons for this course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('order_index');
      
      if (lessonsError) throw lessonsError;
      
      setCourse(courseData);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (course) {
      await enrollInCourse(course.id);
      
      // Show enrollment success animation
      setShowEnrollSuccess(true);
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Hide the success message after a few seconds
      setTimeout(() => {
        setShowEnrollSuccess(false);
      }, 5000);
    }
  };

  const handleStartLearning = () => {
    if (lessons.length > 0) {
      // Navigate to first lesson or current lesson
      const currentLessonId = progress.currentLesson || lessons[0].id;
      navigate(`/learn/${course.id}/${currentLessonId}`);
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

  const getContentTypeIcon = (contentType) => {
    const icons = {
      text: '📖',
      video: '🎥',
      typing_challenge: '⌨️',
      code_exercise: '💻',
      quiz: '📝'
    };
    return icons[contentType] || '📄';
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    return Math.round((progress.completedLessons.length / lessons.length) * 100);
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
            Loading Course...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="#000">
        <VStack spacing={4}>
          <ChakraText color="#ff6b6b" fontSize="xl" fontFamily="'Courier New', monospace">
            ❌ Course Not Found
          </ChakraText>
          <Button 
            bg="#00ff00" 
            color="#000" 
            onClick={() => navigate('/marketplace')}
            fontFamily="'Courier New', monospace"
          >
            ← Back to Marketplace
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" h="100%" overflow="hidden" display="flex" flexDirection="column" bg="#000">
      {/* Course Header */}
      <Box 
        bg="linear-gradient(135deg, #111 0%, #000 100%)" 
        borderBottom="1px solid #333" 
        p={6}
        flexShrink={0}
      >
        <VStack spacing={4} maxW="1200px" mx="auto">
          <HStack w="100%" justify="space-between" align="start">
            <VStack align="start" spacing={3} flex={1}>
              <HStack spacing={2}>
                <Button 
                  size="sm" 
                  bg="#333" 
                  color="#ccc" 
                  onClick={() => navigate('/marketplace')}
                  fontFamily="'Courier New', monospace"
                >
                  ← Back
                </Button>
                <Badge bg={getDifficultyColor(course.difficulty)} color="white" fontSize="xs">
                  {course.difficulty.toUpperCase()}
                </Badge>
                <Badge bg="#333" color="white" fontSize="xs">
                  {getLanguageIcon(course.language)} {course.language.toUpperCase()}
                </Badge>
              </HStack>

              <ChakraText fontSize="3xl" fontWeight="bold" color="#00ff00">
                {course.title}
              </ChakraText>

              <ChakraText fontSize="lg" color="#ccc" maxW="600px">
                {course.description}
              </ChakraText>

              <HStack spacing={6} fontSize="sm" color="#666">
                <ChakraText>👨‍🏫 {course.instructor_name}</ChakraText>
                <ChakraText>📚 {course.lessons_count} lessons</ChakraText>
                <ChakraText>⏱️ {course.duration_hours} hours</ChakraText>
                <ChakraText>⭐ {course.rating}</ChakraText>
                <ChakraText>👥 {course.students_count} students</ChakraText>
              </HStack>
            </VStack>

            <VStack spacing={4} align="end">
              <ChakraText fontSize="2xl" color="#ffd93d" fontWeight="bold">
                ${course.price}
              </ChakraText>
              
              {enrolled ? (
                <VStack spacing={2}>
                  <Button
                    bg="#00ff00"
                    color="#000"
                    size="lg"
                    fontFamily="'Courier New', monospace"
                    fontWeight="bold"
                    onClick={handleStartLearning}
                    _hover={{ bg: "#00cc00" }}
                  >
                    {progress.completedLessons.length > 0 ? '📖 Continue Learning' : '🚀 Start Learning'}
                  </Button>
                  
                  {progress.completedLessons.length > 0 && (
                    <VStack spacing={1}>
                      <ChakraText fontSize="sm" color="#ffd93d">
                        {getCompletionPercentage(course.id).toFixed(0)}% Complete
                      </ChakraText>
                      <Box w="200px" h="4px" bg="#333" borderRadius="2px">
                        <Box 
                          w={`${getCompletionPercentage(course.id).toFixed(0)}%`} 
                          h="100%" 
                          bg="#ffd93d" 
                          borderRadius="2px"
                          transition="width 0.3s"
                        />
                      </Box>
                    </VStack>
                  )}
                </VStack>
              ) : (
                <Button
                  bg="#ff6b6b"
                  color="#fff"
                  size="lg"
                  fontFamily="'Courier New', monospace"
                  fontWeight="bold"
                  onClick={handleEnroll}
                  _hover={{ bg: "#ff8e8e" }}
                  isDisabled={showEnrollSuccess}
                >
                  💳 Enroll Now
                </Button>
              )}
              
              {/* Enrollment Success Message */}
              {showEnrollSuccess && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  bg="#111"
                  border="1px solid #00ff00"
                  borderRadius="md"
                  p={3}
                  mt={4}
                  textAlign="center"
                  boxShadow="0 0 15px #00ff0066"
                >
                  <ChakraText color="#00ff00" fontSize="sm" fontWeight="bold">
                    🎮 Quest Started! Your adventure begins now.
                  </ChakraText>
                  <ChakraText color="#ccc" fontSize="xs" mt={1}>
                    Click 'Start Learning' to begin your journey
                  </ChakraText>
                </MotionBox>
              )}
            </VStack>
          </HStack>
        </VStack>
      </Box>

      {/* Course Content */}
      <Box flex={1} overflow="auto" p={6} bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)">
        <VStack spacing={6} maxW="1200px" mx="auto">
          <HStack justify="space-between" w="100%">
            <ChakraText fontSize="xl" color="#00ff00" fontWeight="bold">
              Course Curriculum
            </ChakraText>
            <ChakraText fontSize="sm" color="#666">
              {lessons.length} lessons • Interactive Learning
            </ChakraText>
          </HStack>

          {/* Lessons List */}
          <VStack spacing={3} w="100%">
            {lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isCurrent = progress.currentLesson === lesson.id;
              const isLocked = !enrolled && index > 0; // First lesson preview for non-enrolled

              return (
                <MotionBox
                  key={lesson.id}
                  w="100%"
                  whileHover={!isLocked ? { scale: 1.01 } : {}}
                  whileTap={!isLocked ? { scale: 0.99 } : {}}
                >
                  <Box
                    bg={isCurrent ? "#003300" : "#111"}
                    border={`1px solid ${isCurrent ? "#00ff00" : "#333"}`}
                    borderRadius="8px"
                    p={4}
                    cursor={!isLocked ? "pointer" : "not-allowed"}
                    opacity={isLocked ? 0.5 : 1}
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/learn/${course.id}/${lesson.id}`);
                      }
                    }}
                    _hover={!isLocked ? {
                      borderColor: "#00ff00",
                      bg: "#112"
                    } : {}}
                    transition="all 0.3s ease"
                  >
                    <HStack justify="space-between" align="center">
                      <HStack spacing={4}>
                        <Box
                          w="40px"
                          h="40px"
                          bg={isCompleted ? "#38A169" : isCurrent ? "#00ff00" : "#333"}
                          borderRadius="50%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color={isCompleted || isCurrent ? "#000" : "#ccc"}
                          fontWeight="bold"
                        >
                          {isCompleted ? "✓" : isLocked ? "🔒" : index + 1}
                        </Box>

                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text color={getContentTypeIcon(lesson.content_type)}>
                              {getContentTypeIcon(lesson.content_type)}
                            </Text>
                            <Text 
                              fontWeight="bold" 
                              color={isCompleted ? "#38A169" : isCurrent ? "#00ff00" : "#ccc"}
                            >
                              {lesson.title}
                            </Text>
                            {isLocked && index === 0 && (
                              <Badge bg="#ffd93d" color="#000" fontSize="xs">
                                FREE PREVIEW
                              </Badge>
                            )}
                          </HStack>
                          
                          <ChakraText fontSize="sm" color="#666">
                            {lesson.content_type === 'typing_challenge' && "Interactive Typing Challenge"}
                            {lesson.content_type === 'code_exercise' && "Hands-on Coding Exercise"}
                            {lesson.content_type === 'text' && "Theory & Explanation"}
                            {lesson.content_type === 'video' && "Video Lesson"}
                            {lesson.content_type === 'quiz' && "Knowledge Assessment"}
                          </ChakraText>
                        </VStack>
                      </HStack>

                      <HStack spacing={2}>
                        {lesson.duration_minutes && (
                          <ChakraText fontSize="sm" color="#666">
                            {lesson.duration_minutes} min
                          </ChakraText>
                        )}
                        
                        {!enrolled && index > 0 && (
                          <ChakraText fontSize="sm" color="#ff6b6b">
                            🔒 Enroll to Access
                          </ChakraText>
                        )}
                      </HStack>
                    </HStack>
                  </Box>
            <ChakraText color="#00ff00" fontFamily="'Courier New', monospace">
              );
            </ChakraText>
          </VStack>

          {/* Course Info */}
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            w="100%"
          >
            <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold" mb={3}>
              🎯 What You'll Learn
            </ChakraText>
            <VStack spacing={2} align="start" fontSize="sm" color="#ccc">
              <ChakraText>✓ Master {course.language} fundamentals and advanced concepts</ChakraText>
              <ChakraText>✓ Build real-world projects with hands-on exercises</ChakraText>
              <ChakraText>✓ Improve typing speed with gamified challenges</ChakraText>
              <ChakraText>✓ Practice code writing in an integrated IDE environment</ChakraText>
              <ChakraText>✓ Earn achievements and track your learning progress</ChakraText>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default ModuleDetailPage;