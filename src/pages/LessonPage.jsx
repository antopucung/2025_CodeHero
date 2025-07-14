import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text, VStack, HStack, Button, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { supabase } from '../lib/supabase';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import TypingChallenge from '../components/TypingChallenge';
import CodeEditorPage from './CodeEditorPage';

const MotionBox = motion(Box);

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { isEnrolled, updateLessonProgress, getCourseProgress } = useUserEnrollment();
  const enrolled = isEnrolled(courseId);
  const progress = getCourseProgress(courseId);

  useEffect(() => {
    if (!enrolled && lesson && lesson.order_index > 0) {
      // Redirect to course page if not enrolled and trying to access non-preview lesson
      navigate(`/modules/${courseId}`);
      return;
    }
    fetchLessonData();
  }, [courseId, lessonId, enrolled]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      // Fetch current lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (lessonError) throw lessonError;
      
      // Fetch all lessons for navigation
      const { data: allLessonsData, error: allLessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (allLessonsError) throw allLessonsError;
      
      setCourse(courseData);
      setLesson(lessonData);
      setAllLessons(allLessonsData || []);
      
      // Check if lesson is already completed
      setLessonCompleted(progress.completedLessons.includes(lessonId));
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = (stats = {}) => {
    const score = stats.totalScore || stats.score || 0;
    updateLessonProgress(courseId, lessonId, true, score);
    setLessonCompleted(true);
  };

  const getNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const calculateCourseProgress = () => {
    if (allLessons.length === 0) return 0;
    return Math.round((progress.completedLessons.length / allLessons.length) * 100);
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    const contentData = lesson.content_data || {};

    switch (lesson.content_type) {
      case 'text':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📖 {lesson.title}
            </Text>
            <VStack spacing={4} align="start">
              <Text color="#ccc" lineHeight="1.6">
                {contentData.content || "This is a text-based lesson. The content would be loaded from the database."}
              </Text>
              
              {contentData.code_example && (
                <Box
                  bg="#000"
                  border="1px solid #444"
                  borderRadius="4px"
                  p={4}
                  w="100%"
                  fontFamily="'Courier New', monospace"
                  fontSize="sm"
                >
                  <Text color="#666" fontSize="xs" mb={2}>Code Example:</Text>
                  <Text color="#00ff00" whiteSpace="pre-wrap">
                    {contentData.code_example}
                  </Text>
                </Box>
              )}
              
              <Button
                bg="#00ff00"
                color="#000"
                onClick={handleLessonComplete}
                fontFamily="'Courier New', monospace"
                disabled={lessonCompleted}
              >
                {lessonCompleted ? "✓ Completed" : "Mark as Complete"}
              </Button>
            </VStack>
          </Box>
        );

      case 'typing_challenge':
        return (
          <Box w="100%" h="100%">
            <TypingChallenge
              challenge={{
                id: `lesson-${lesson.id}`,
                title: lesson.title,
                description: "Type the code accurately to complete this lesson",
                code: contentData.code || `function greet(name) {\n    console.log("Hello, " + name + "!");\n}\n\ngreet("World");`,
                language: contentData.language || course.language,
                difficulty: contentData.difficulty || course.difficulty
              }}
              currentLevel={1}
              onComplete={handleLessonComplete}
              isActive={true}
              fullScreen={true}
            />
          </Box>
        );

      case 'code_exercise':
        return (
          <Box w="100%" h="100%">
            <VStack spacing={4} h="100%">
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="8px"
                p={4}
                w="100%"
                flexShrink={0}
              >
                <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={2}>
                  💻 {lesson.title}
                </Text>
                <Text color="#ccc" fontSize="sm">
                  {contentData.instructions || "Complete the coding exercise below. Test your code to verify it works correctly."}
                </Text>
              </Box>
              
              <Box flex={1} w="100%">
                <CodeEditorPage 
                  initialCode={contentData.starter_code || "// Write your code here"}
                  language={contentData.language || course.language}
                  onCodeExecuted={(result) => {
                    if (!result.error) {
                      handleLessonComplete({ score: 100 });
                    }
                  }}
                />
              </Box>
            </VStack>
          </Box>
        );

      case 'video':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              🎥 {lesson.title}
            </Text>
            <Box
              bg="#000"
              border="1px solid #444"
              borderRadius="8px"
              p={8}
              textAlign="center"
              color="#666"
              mb={4}
            >
              <Text mb={2}>Video Player</Text>
              <Text fontSize="sm">Video URL: {contentData.video_url || "No video URL specified"}</Text>
            </Box>
            <Button
              bg="#00ff00"
              color="#000"
              onClick={handleLessonComplete}
              fontFamily="'Courier New', monospace"
              disabled={lessonCompleted}
            >
              {lessonCompleted ? "✓ Completed" : "Mark as Complete"}
            </Button>
          </Box>
        );

      case 'quiz':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📝 {lesson.title}
            </Text>
            <Text color="#ccc" mb={4}>
              Quiz functionality will be implemented here.
            </Text>
            <Button
              bg="#00ff00"
              color="#000"
              onClick={handleLessonComplete}
              fontFamily="'Courier New', monospace"
              disabled={lessonCompleted}
            >
              {lessonCompleted ? "✓ Completed" : "Complete Quiz"}
            </Button>
          </Box>
        );

      default:
        return (
          <Box textAlign="center" p={8}>
            <Text color="#ff6b6b">Unknown lesson type: {lesson.content_type}</Text>
          </Box>
        );
    }
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
            Loading Lesson...
          </Text>
        </VStack>
      </Box>
    );
  }

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);

  return (
    <Box w="100%" h="100%" overflow="hidden" display="flex" flexDirection="column" bg="#000">
      {/* Lesson Header */}
      <Box 
        bg="#111" 
        borderBottom="1px solid #333" 
        p={4}
        flexShrink={0}
      >
        <VStack spacing={3} maxW="1200px" mx="auto">
          <HStack w="100%" justify="space-between" align="center">
            <HStack spacing={3}>
              <Button 
                size="sm" 
                bg="#333" 
                color="#ccc" 
                onClick={() => navigate(`/modules/${courseId}`)}
                fontFamily="'Courier New', monospace"
              >
                ← {course?.title}
              </Button>
              
              <Text color="#666" fontSize="sm">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </Text>
            </HStack>

            <HStack spacing={4}>
              <VStack spacing={0} align="end">
                <Text fontSize="sm" color="#666">Course Progress</Text>
                <Text fontSize="sm" color="#ffd93d" fontWeight="bold">
                  {calculateCourseProgress()}% Complete
                </Text>
              </VStack>
              
              <Box w="150px">
                <Progress 
                  value={calculateCourseProgress()} 
                  bg="#333" 
                  borderRadius="2px"
                  h="6px"
                  sx={{
                    '& > div': {
                      bg: 'linear-gradient(90deg, #ffd93d, #ffed4e)',
                    }
                  }}
                />
              </Box>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Lesson Content */}
      <Box flex={1} overflow="hidden">
        {lesson?.content_type === 'typing_challenge' || lesson?.content_type === 'code_exercise' ? (
          renderLessonContent()
        ) : (
          <Box h="100%" overflow="auto" p={6}>
            {renderLessonContent()}
          </Box>
        )}
      </Box>

      {/* Navigation Footer */}
      <Box 
        bg="#111" 
        borderTop="1px solid #333" 
        p={4}
        flexShrink={0}
      >
        <HStack justify="space-between" maxW="1200px" mx="auto">
          <Box>
            {prevLesson ? (
              <Button
                bg="#333"
                color="#ccc"
                onClick={() => navigate(`/learn/${courseId}/${prevLesson.id}`)}
                fontFamily="'Courier New', monospace"
                _hover={{ bg: "#444" }}
              >
                ← Previous: {prevLesson.title}
              </Button>
            ) : (
              <Box />
            )}
          </Box>

          <Box>
            {nextLesson ? (
              <Button
                bg={lessonCompleted ? "#00ff00" : "#666"}
                color={lessonCompleted ? "#000" : "#ccc"}
                onClick={() => {
                  if (lessonCompleted) {
                    navigate(`/learn/${courseId}/${nextLesson.id}`);
                  }
                }}
                fontFamily="'Courier New', monospace"
                disabled={!lessonCompleted}
                _hover={lessonCompleted ? { bg: "#00cc00" } : {}}
              >
                Next: {nextLesson.title} →
              </Button>
            ) : lessonCompleted ? (
              <Button
                bg="#ff6b6b"
                color="#fff"
                onClick={() => navigate(`/modules/${courseId}`)}
                fontFamily="'Courier New', monospace"
                _hover={{ bg: "#ff8e8e" }}
              >
                🎉 Course Complete!
              </Button>
            ) : (
              <Box />
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default LessonPage;